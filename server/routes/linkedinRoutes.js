

import express from "express";
import axios from "axios";

const router = express.Router();


router.get("/auth", (req, res) => {
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const scope = "r_liteprofile r_emailaddress"; 
  const state = "someRandomStateValue"; 

  const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${encodeURIComponent(scope)}`;

  res.redirect(linkedInAuthUrl);
});


router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  // Optionally, validate the 'state' parameter here against the one you set.
  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // Fetch the basic user profile
    const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Fetch the user's email address
    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const profileData = {
      profile: profileResponse.data,
      email: emailResponse.data.elements[0]["handle~"].emailAddress,
      access_token,
      expires_in,
    };

    // At this point, you can choose to store the profile data in your database,
    // establish a session, or return the data directly.
    // For demonstration, we'll simply return it as JSON.
    return res.json({ success: true, data: profileData });
  } catch (error) {
    console.error(
      "LinkedIn OAuth Error:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "LinkedIn authentication failed" });
  }
});

export default router;
