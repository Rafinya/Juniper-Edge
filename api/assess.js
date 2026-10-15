// api/assess.js
// Vercel Serverless Function to handle Visa Eligibility Wizard submissions

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, visaGoal, destination, education, details, recommendation } = req.body;

        // Basic validation
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields: name, email, and phone are required.' });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error('RESEND_API_KEY environment variable is not configured.');
            return res.status(500).json({ error: 'Server configuration error: Email service API key is missing.' });
        }

        // Formulate a premium HTML email body for Admin
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>New Visa Assessment Submission</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333; margin: 0; padding: 0; }
                    .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
                    .header { background: linear-gradient(135deg, #111e25 0%, #1e323d 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
                    .header p { margin: 5px 0 0 0; font-size: 14px; color: #a1b0cb; }
                    .content { padding: 30px; }
                    .status-banner { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 25px; }
                    .status-title { font-size: 20px; font-weight: 700; color: #cf2e2e; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
                    .status-label { font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1.5px; margin-top: 5px; display: block; }
                    .section-title { font-size: 16px; font-weight: 600; color: #111e25; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                    .info-item { background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #f1f5f9; }
                    .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; display: block; }
                    .info-value { font-size: 14px; font-weight: 600; color: #0f172a; }
                    .recommendation-box { background: #fffbeb; border-left: 4px solid #cf2e2e; padding: 15px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #78350f; margin-bottom: 20px; }
                    .details-list { padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155; }
                    .footer { background: #f8fafc; text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                    .footer a { color: #cf2e2e; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <img src="https://juniperedge.co.ke/assets/logo.jpeg" alt="Juniper Edge Logo" style="height: 60px; width: auto; border-radius: 6px; margin-bottom: 12px; display: inline-block; vertical-align: middle; background-color: #ffffff; padding: 4px;">
                        <h1>JUNIPER EDGE</h1>
                        <p>Visa Assessment Report</p>
                    </div>
                    <div class="content">
                        <div class="status-banner">
                            <p class="status-title">Visa Eligibility Check</p>
                            <span class="status-label">Submitted Successfully</span>
                        </div>

                        <div class="section-title">Applicant Details</div>
                        <div style="margin-bottom: 20px;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Full Name:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;"><a href="mailto:${email}" style="color: #cf2e2e; text-decoration: none;">${email}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${phone}</td>
                                </tr>
                            </table>
                        </div>

                        <div class="section-title">Assessment Choices</div>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #f1f5f9; color: #64748b;">Visa Goal</td>
                                <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #f1f5f9; color: #0f172a; font-weight: 600; text-transform: capitalize;">${visaGoal}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 12px; border: 1px solid #f1f5f9; color: #64748b;">Destination</td>
                                <td style="padding: 8px 12px; border: 1px solid #f1f5f9; color: #0f172a; font-weight: 600; text-transform: capitalize;">${destination}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #f1f5f9; color: #64748b;">Education</td>
                                <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #f1f5f9; color: #0f172a; font-weight: 600; text-transform: capitalize;">${education}</td>
                            </tr>
                        </table>

                        <div class="section-title">System Recommendation</div>
                        <div class="recommendation-box">
                            ${recommendation}
                        </div>

                        <div class="section-title">Profile Parameters</div>
                        <ul class="details-list">
                            ${details}
                        </ul>
                    </div>
                    <div class="footer">
                        <p>This inquiry was sent from the Juniper Edge Visa Assessment Wizard.</p>
                        <p>&copy; 2026 <a href="https://juniperedge.co.ke">Juniper Edge Tours & Travel</a>. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Formulate user confirmation email
        const userHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Visa Assessment Received - Juniper Edge</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333; margin: 0; padding: 0; }
                    .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
                    .header { background: linear-gradient(135deg, #111e25 0%, #1e323d 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
                    .header p { margin: 5px 0 0 0; font-size: 14px; color: #a1b0cb; }
                    .content { padding: 30px; line-height: 1.6; }
                    .thank-you { font-size: 18px; font-weight: 600; color: #111e25; margin-bottom: 15px; }
                    .details-box { background: #f8fafc; border-left: 4px solid #cf2e2e; padding: 15px; border-radius: 4px; font-size: 14px; color: #475569; margin-bottom: 25px; }
                    .section-title { font-size: 16px; font-weight: 600; color: #111e25; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .recommendation-box { background: #fffbeb; border-left: 4px solid #cf2e2e; padding: 15px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #78350f; margin-bottom: 20px; }
                    .details-list { padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155; }
                    .footer { background: #f8fafc; text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                    .footer a { color: #cf2e2e; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <img src="https://juniperedge.co.ke/assets/logo.jpeg" alt="Juniper Edge Logo" style="height: 60px; width: auto; border-radius: 6px; margin-bottom: 12px; display: inline-block; vertical-align: middle; background-color: #ffffff; padding: 4px;">
                        <h1>JUNIPER EDGE</h1>
                        <p>Visa Assessment Confirmation</p>
                    </div>
                    <div class="content">
                        <div class="thank-you">Hello ${name},</div>
                        <p>Thank you for using the <strong>Juniper Edge Visa Eligibility Wizard</strong>! We have successfully received your eligibility assessment details.</p>
                        
                        <div class="details-box">
                            <strong>What's Next?</strong><br>
                            Our professional visa and immigration consultants are reviewing your details. We will contact you shortly on your phone number (<strong>${phone}</strong>) or email (<strong>${email}</strong>) to guide you on the next steps of your migration journey.
                        </div>

                        <div class="section-title">Your Profile Recommendation</div>
                        <div class="recommendation-box">
                            ${recommendation}
                        </div>

                        <div class="section-title">Submitted Profile Parameters</div>
                        <ul class="details-list">
                            ${details}
                        </ul>
                        
                        <p>If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:juniperedgetoursandtravel@gmail.com" style="color: #cf2e2e; text-decoration: none;">juniperedgetoursandtravel@gmail.com</a>.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated confirmation email regarding your visa eligibility check.</p>
                        <p>&copy; 2026 <a href="https://juniperedge.co.ke">Juniper Edge Tours & Travel</a>. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send requests to Resend API (Admin Notification + Applicant Confirmation)
        const [responseAdmin, responseUser] = await Promise.all([
            fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Juniper Edge <noreply@juniperedge.co.ke>',
                    to: 'juniperedgetoursandtravel@gmail.com',
                    reply_to: email,
                    subject: `New Visa Eligibility Check: ${name}`,
                    html: htmlContent
                })
            }),
            fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Juniper Edge <noreply@juniperedge.co.ke>',
                    to: email,
                    subject: `Visa Eligibility Check Received - Juniper Edge`,
                    html: userHtmlContent
                })
            })
        ]);

        const dataAdmin = await responseAdmin.json();
        const dataUser = await responseUser.json();

        if (!responseAdmin.ok) {
            console.error('Resend Admin Assessment Notification Error:', dataAdmin);
            throw new Error(`Resend admin notification failed: ${dataAdmin.message || responseAdmin.statusText}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Assessment submitted and confirmation emails dispatched.',
            adminEmailId: dataAdmin.id,
            userEmailId: dataUser.id
        });

    } catch (error) {
        console.error('Visa Assessment Serverless Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to process visa assessment.' });
    }
}
