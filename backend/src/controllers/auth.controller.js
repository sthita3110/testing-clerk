import { Webhook } from "svix";
import { User } from "../models/user.model.js";

// Function to save or update a user
const saveOrUpdateUser = async (userData) => {
  const { id, first_name, last_name, email_addresses, image_url } = userData;

  const newUserData = {
    fullName: `${first_name} ${last_name}`,
    email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "", // Safe check for email
    imageUrl: image_url,
    clerkId: id,
  };

  await User.findOneAndUpdate(
    { clerkId: id }, // Search condition
    { $set: newUserData }, // Update data
    { upsert: true, new: true } // `upsert: true` creates the document if it doesn't exist
  );

};

// Function to handle webhook verification
const verifyWebhook = (req, secret) => {
  const { "svix-id": svixId, "svix-signature": svixSignature, "svix-timestamp": svixTimestamp } = req.headers;

  if (!svixId || !svixSignature || !svixTimestamp) {
    throw new Error("Missing required headers");
  }

  const wh = new Webhook(secret);
  const payloadString = req.body.toString();
  return wh.verify(payloadString, { "svix-id": svixId, "svix-signature": svixSignature, "svix-timestamp": svixTimestamp });
};

// Main handler function for the auth callback
export const authCallback = async (req, res) => {
  try {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      return res.status(400).json({ success: false, message: 'Missing SIGNING_SECRET' });
    }

    const evt = verifyWebhook(req, SIGNING_SECRET);
    const { id, ...attributes } = evt.data;
    const eventType = evt.type;

    // Process event based on type
    switch (eventType) {
      case "user.created":
      case "user.updated":
        await saveOrUpdateUser({ ...attributes, id });
        break;
      case "user.deleted":
        await User.findOneAndDelete({ clerkId: id });
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });

  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
