// utils/managerReportEmail.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendManagerReportEmail = async (managerEmail, report) => {
  try {
    // Format the date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create HTML email template
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Performance Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea; margin-bottom: 30px; }
        .date { font-size: 16px; color: #666; margin-bottom: 5px; }
        h1 { color: #2c3e50; margin: 0; }
        .card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 25px; margin-bottom: 25px; }
        .card-title { font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 15px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
        .stat-item { background: #f8f9fa; padding: 15px; border-radius: 6px; }
        .stat-value { font-size: 24px; font-weight: 700; color: #3498db; }
        .stat-label { font-size: 13px; color: #7f8c8d; text-transform: uppercase; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f8f9fa; text-align: left; padding: 12px 15px; font-weight: 600; }
        td { padding: 12px 15px; border-bottom: 1px solid #eaeaea; }
        .footer { text-align: center; margin-top: 30px; color: #7f8c8d; font-size: 14px; }
        .highlight { background-color: #f8f9fa; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="date">${formattedDate}</div>
            <h1>Daily Performance Report</h1>
        </div>
        
        <div class="card">
            <div class="card-title">Manager Information</div>
            <p><strong>Name:</strong> ${report.managerInfo.name}</p>
            <p><strong>Email:</strong> ${report.managerInfo.email}</p>
            <p><strong>Phone:</strong> ${report.managerInfo.phone}</p>
        </div>
        
        <div class="card">
            <div class="card-title">Team Overview</div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${report.teamStats.totalAmbassadors}</div>
                    <div class="stat-label">Total Ambassadors</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${report.teamStats.totalUsers}</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">₦${report.teamStats.totalTodaySales.toLocaleString()}</div>
                    <div class="stat-label">Today's Sales</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">₦${report.teamStats.totalAllTimeSales.toLocaleString()}</div>
                    <div class="stat-label">All Time Sales</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">₦${report.teamStats.totalCommission.toLocaleString()}</div>
                    <div class="stat-label">Total Commission</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-title">Sales by Product</div>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Total Sales</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.salesByProduct.map(product => `
                        <tr>
                            <td>${product.productName}</td>
                            <td>₦${product.totalSales.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="card">
            <div class="card-title">Ambassador Performance</div>
            <table>
                <thead>
                    <tr>
                        <th>Ambassador</th>
                        <th>Users</th>
                        <th>Today's Sales</th>
                        <th>All Time Sales</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.ambassadorsPerformance.map(ambassador => `
                        <tr>
                            <td>${ambassador.name}</td>
                            <td>${ambassador.usersCount}</td>
                            <td>₦${ambassador.todaySales.toLocaleString()}</td>
                            <td>₦${ambassador.allTimeSales.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                    <tr class="highlight">
                        <td>TOTAL</td>
                        <td>${report.teamStats.totalUsers}</td>
                        <td>₦${report.teamStats.totalTodaySales.toLocaleString()}</td>
                        <td>₦${report.teamStats.totalAllTimeSales.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>This is an automated report. Please contact support if you have any questions.</p>
            <p>© ${today.getFullYear()} Ay Developers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Send the email
    await resend.emails.send({
      from: 'Ay Developers Reports <reports@aydevelopers.com.ng>',
      to: managerEmail,
      subject: `Daily Performance Report - ${formattedDate}`,
      html: html
    });

    console.log(`Daily report email sent to ${managerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending manager report email:', error);
    throw error;
  }
};

module.exports = { sendManagerReportEmail };