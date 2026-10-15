// api/apply.js
// Vercel Serverless Function to handle Careers Job Applications and Resume/Document uploads

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            name,
            email,
            phone,
            job,
            education,
            message,
            resumeData,
            resumeName,
            certData,
            certName,
            idData,
            idName,
            passportData,
            passportName
        } = req.body;

        // Basic validation
        if (!name || !email || !phone || !job) {
            return res.status(400).json({ error: 'Missing required fields: name, email, phone, and job are required.' });
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
                <title>New Job Application Submission</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333; margin: 0; padding: 0; }
                    .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
                    .header { background: linear-gradient(135deg, #111e25 0%, #1e323d 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
                    .header p { margin: 5px 0 0 0; font-size: 14px; color: #a1b0cb; }
                    .content { padding: 30px; }
                    .job-tag { background: #bf9456; color: #ffffff; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; display: inline-block; margin-bottom: 20px; }
                    .section-title { font-size: 16px; font-weight: 600; color: #111e25; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
                    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px; font-style: italic; }
                    .attachment-box { display: flex; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; color: #166534; font-size: 13px; margin-top: 15px; }
                    .footer { background: #f8fafc; text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                    .footer a { color: #bf9456; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <img src="https://juniperedge.co.ke/assets/logo.jpeg" alt="Juniper Edge Logo" style="height: 60px; width: auto; border-radius: 6px; margin-bottom: 12px; display: inline-block; vertical-align: middle; background-color: #ffffff; padding: 4px;">
                        <h1>JUNIPER EDGE</h1>
                        <p>New Job Application Received</p>
                    </div>
                    <div class="content">
                        <div class="job-tag">${job}</div>

                        <div class="section-title">Applicant Details</div>
                        <div style="margin-bottom: 20px;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b; width: 150px;"><strong>Full Name:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;"><a href="mailto:${email}" style="color: #bf9456; text-decoration: none;">${email}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${phone}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Applied Position:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${job}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;"><strong>Education Level:</strong></td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-transform: capitalize;">${education || 'Not Provided'}</td>
                                </tr>
                            </table>
                        </div>

                        ${message ? `
                        <div class="section-title">Cover Message / Notes</div>
                        <div class="message-box">
                            "${message.replace(/\n/g, '<br>')}"
                        </div>
                        ` : ''}

                        <div class="section-title">Attached Documents</div>
                        <ul style="padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
                            ${resumeName ? `<li><strong>Resume/CV:</strong> ${resumeName}</li>` : '<li><span style="color:red;">⚠️ No Resume Uploaded</span></li>'}
                            ${certName ? `<li><strong>School Certificate:</strong> ${certName}</li>` : '<li><span style="color:red;">⚠️ No Certificate Uploaded</span></li>'}
                            ${idName ? `<li><strong>National ID:</strong> ${idName}</li>` : '<li><span style="color:red;">⚠️ No ID Uploaded</span></li>'}
                            ${passportName ? `<li><strong>International Passport:</strong> ${passportName}</li>` : '<li><span style="color:red;">⚠️ No Passport Uploaded</span></li>'}
                        </ul>
                    </div>
                    <div class="footer">
                        <p>This application was sent from the Juniper Edge Careers & Placements Job Board.</p>
                        <p>&copy; 2026 <a href="https://juniperedge.co.ke">Juniper Edge Tours & Travel</a>. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Handle attachments for Resend
        let attachments = [];
        const addAttachment = (fileData, fileName) => {
            if (fileData && fileName) {
                const base64Content = fileData.split(';base64,').pop();
                attachments.push({
                    content: base64Content,
                    filename: fileName
                });
            }
        };

        addAttachment(resumeData, resumeName);
        addAttachment(certData, certName);
        addAttachment(idData, idName);
        addAttachment(passportData, passportName);

        // Formulate user confirmation email
        const userHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Application Received - Juniper Edge</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333; margin: 0; padding: 0; }
                    .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
                    .header { background: linear-gradient(135deg, #111e25 0%, #1e323d 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
                    .header p { margin: 5px 0 0 0; font-size: 14px; color: #a1b0cb; }
                    .content { padding: 30px; line-height: 1.6; }
                    .thank-you { font-size: 18px; font-weight: 600; color: #111e25; margin-bottom: 15px; }
                    .details-box { background: #f8fafc; border-left: 4px solid #cf2e2e; padding: 15px; border-radius: 4px; font-size: 14px; color: #475569; margin-bottom: 25px; }
                    .footer { background: #f8fafc; text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                    .footer a { color: #cf2e2e; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <img src="https://juniperedge.co.ke/assets/logo.jpeg" alt="Juniper Edge Logo" style="height: 60px; width: auto; border-radius: 6px; margin-bottom: 12px; display: inline-block; vertical-align: middle; background-color: #ffffff; padding: 4px;">
                        <h1>JUNIPER EDGE</h1>
                        <p>Application Confirmation</p>
                    </div>
                    <div class="content">
                        <div class="thank-you">Hello ${name},</div>
                        <p>Thank you for applying for the position of <strong>${job}</strong> with Juniper Edge Tours & Travel.</p>
                        <p>We have successfully received your application, resume, and associated credentials (education certificates, National ID, and Passport). Our recruitment and placement team is currently reviewing your qualifications against the requirements for this role.</p>
                        <div class="details-box">
                            <strong>What's Next?</strong><br>
                            If your profile matches what our partner employers are looking for, a member of our team will contact you in due time to schedule an interview and discuss the next steps in the recruitment and visa sponsorship process.
                        </div>
                        <p>If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:juniperedgetoursandtravel@gmail.com" style="color: #cf2e2e; text-decoration: none;">juniperedgetoursandtravel@gmail.com</a>.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated confirmation email regarding your job application.</p>
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
                    from: 'Juniper Edge Careers <careers@juniperedge.co.ke>',
                    to: 'juniperedgetoursandtravel@gmail.com',
                    subject: `[Job Application] ${job} - ${name}`,
                    html: htmlContent,
                    attachments: attachments.length > 0 ? attachments : undefined
                })
            }),
            fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Juniper Edge Careers <careers@juniperedge.co.ke>',
                    to: email,
                    subject: `Application Received: ${job}`,
                    html: userHtmlContent
                })
            })
        ]);

        const dataAdmin = await responseAdmin.json();
        const dataUser = await responseUser.json();

        if (!responseAdmin.ok) {
            console.error('Resend Admin Notification Error:', dataAdmin);
            throw new Error(`Resend admin notification failed: ${dataAdmin.message || responseAdmin.statusText}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Application submitted and confirmation emails dispatched.',
            adminEmailId: dataAdmin.id,
            userEmailId: dataUser.id
        });

    } catch (error) {
        console.error('Careers Submission Function Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to process job application.' });
    }
}
