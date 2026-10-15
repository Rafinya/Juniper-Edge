// api/welcome.js
// Vercel Serverless Function to handle Welcome Emails on User Registration

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Missing name or email' });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error('RESEND_API_KEY environment variable is not configured.');
            return res.status(500).json({ error: 'Server configuration error: Email service API key is missing.' });
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Welcome to Juniper Edge</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333; margin: 0; padding: 0; }
                    .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
                    .header { background: linear-gradient(135deg, #cf2e2e 0%, #9e1b1b 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
                    .header p { margin: 5px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.8); }
                    .content { padding: 30px; line-height: 1.6; }
                    .welcome-title { font-size: 18px; font-weight: 600; color: #111e25; margin-bottom: 15px; }
                    .company-details { background: #f8fafc; border-left: 4px solid #cf2e2e; padding: 15px; border-radius: 4px; font-size: 14px; color: #475569; margin-bottom: 25px; }
                    .feature-list { list-style-type: none; padding: 0; margin: 20px 0; }
                    .feature-item { margin-bottom: 15px; padding-left: 25px; position: relative; font-size: 14px; color: #334155; }
                    .feature-item::before { content: '✓'; position: absolute; left: 0; top: 0; color: #cf2e2e; font-weight: bold; }
                    .cta-btn { display: inline-block; background-color: #cf2e2e; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 4px; margin-top: 20px; text-align: center; }
                    .footer { background: #f8fafc; text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                    .footer a { color: #cf2e2e; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <img src="https://juniperedge.co.ke/assets/logo.jpeg" alt="Juniper Edge Logo" style="height: 60px; width: auto; border-radius: 6px; margin-bottom: 12px; display: inline-block; vertical-align: middle; background-color: #ffffff; padding: 4px;">
                        <h1>JUNIPER EDGE</h1>
                        <p>Tours & Travel | Premium Travel & Immigration</p>
                    </div>
                    <div class="content">
                        <div class="welcome-title">Welcome to Juniper Edge, ${name}!</div>
                        <p>Thank you for signing up and creating your account with <strong>Juniper Edge</strong>! We are excited to have you join our premium network of global travelers and visa applicants.</p>
                        
                        <div class="company-details">
                            <strong>About Juniper Edge</strong><br>
                            We are a premier travel, tours, and immigration consultancy dedicated to helping clients navigate complex visa frameworks, discover breathtaking tour destinations, and transition to global careers and academic pathways.
                        </div>

                        <p>Here is what you can do now with your Juniper account:</p>
                        <ul class="feature-list">
                            <li class="feature-item"><strong>Start Visa Assessments</strong>: Unlock our digital eligibility wizard to check your points and qualify for study, work, or migration pathways.</li>
                            <li class="feature-item"><strong>Explore Sponsored Jobs</strong>: Visit our careers board to view active sponsorships and apply directly.</li>
                            <li class="feature-item"><strong>Book Tours & Travel Packages</strong>: Discover curated holiday packages and send booking inquiries.</li>
                        </ul>

                        <div style="text-align: center;">
                            <a href="https://juniperedge.co.ke" class="cta-btn">Return to Website</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated welcome email. Please do not reply directly to this message.</p>
                        <p>&copy; 2026 <a href="https://juniperedge.co.ke">Juniper Edge Tours & Travel</a>. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Juniper Edge <noreply@juniperedge.co.ke>',
                to: email,
                subject: `Welcome to Juniper Edge, ${name}!`,
                html: htmlContent
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend Welcome Email Error:', data);
            return res.status(response.status).json({ error: data.message || 'Failed to send welcome email' });
        }

        return res.status(200).json({ success: true, message: 'Welcome email sent successfully!', data });

    } catch (error) {
        console.error('Welcome Email Serverless Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
