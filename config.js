// Email Configuration
// To enable email notifications, fill in your details below

module.exports = {
  email: {
    enabled: true, // Set to true when you add credentials
    
    // Gmail settings (recommended)
    service: 'gmail',
    user: 'pradipchand714@gmail.com', // Your Gmail address
    pass: 'swbo jcrk vlwt hymw',     // 16-char app password from Google Account
    
    // Alternative: Use environment variables (more secure)
    // Set these if using .env file:
    // EMAIL_USER=pradipchand714@gmail.com
    // EMAIL_PASS=your-app-password
    
    // Recipient (where notifications go)
    recipient: 'pradipchand714@gmail.com', // Where you want to receive complaint notifications
    
    // Email subject template
    subject: '[Save Nepal] New Complaint Filed - {id}',
  },
  
  // Rate limiting
  rateLimit: {
    maxComplaintsPerDay: 5,
    trackingByIP: true, // Track by user's IP address
  }
};
