export const authCallback = async(req, res, next) =>{
    //logic for signup and login
    try {
        const { token } = req.headers.authorization; // Assuming the JWT is sent in the Authorization header
        
        if (!token) {
          return res.status(400).json({ success: false, message: 'Token not provided' });
        }
    
        // Verify the JWT token with Clerk's API
        const verifyResponse = await axios.post(
          'https://api.clerk.dev/v1/users/me',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        const { id, firstName, lastName, imageUrl, email } = verifyResponse.data;
    
        // Find the user in the database using the Clerk ID
        const user = await User.findOne({ clerkId });
    
        if (!user) {
          try {
            // Create a new user if not found
            await User.create({
              id: clerkId,
              fullName: `${firstName} ${lastName}`,
              imageUrl,
              email,
            });
          } catch (createError) {
            // Handle duplicate key error or any other errors during user creation
            if (createError.code === 11000) {
              console.log("Duplicate key error during signup");
            } else {
              throw createError; // Re-throw other errors
            }
          }
        }
    
        // Return success response
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error in handleClerkAuth:", error);
        next(error); // Pass the error to the error handler
      }
}