- To change email addresses:

1. navigate to /backend/utils/email_address.js.
2. change the INTRUCTOR_EMAIL to the email of the workshop instructor, who will receive the report.
3. change the REPORT_SENDER_EMAIL and CERTIFICATE_SENDER_EMAIL to the emails who will be used to send out the report and
the certificates respectively (1 email for both could be an option but not recommended!).
4. in transporter = nodemailer.createTransport(), change "service" value accordingly to the service of the email. For example : 'hotmail' for Outlook, etc. See more details: https://nodemailer.com/smtp/well-known/. There is also a known problem with Gmail when using Nodemailer, see more at: https://nodemailer.com/usage/using-gmail/. 


- To change scheduled task timer with node-cron to send the report:

1. in cron.schedule, change "scheduled" value to 'true' to turn on the scheduled task, set it back to 'false' to turn off. It should be 'true' before each workshop and can be turned off after the workshop has been closed.
2. in the first parameter where the asterisks locate, replace these asterisks to indicate the time the scheduled task should run. From right to left, each asterisk indicates the day of week, month, day of month, hour, minute and second. Here are some examples:

(0 0 21 * *) = every twenty-first day of the month at 00:00 AM
(59 23 * * *) = everyday at 11:59 PM
(0 0 * * 3) = every Wednesday at 00:00 AM
(0 4 * * 2) = every Tuesday at 4:00 AM

The default value is (0 13 * * 1), which indicates that the cronjob should run everyweek on Monday at 1:00 PM. This value can be adapted to align with the workshop. It can also be set to ( * * * * * ) for example in testing phase, which make it run every single minute. However, setting this may result in the following spamming email problem.
See more details: https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples


********Regarding the spamming email problem********
There is a known problem when sending too many emails in a short amount of time, the email addresses can be marked as spam and blocked by some popular email service like Google, Outlook, etc. The workaround is to replace them with new email accounts. Another approach could be to use the email server from university, which will probably require some configurations like DomainKeys Identified Mail(DKIM), SenderID, Email signature, etc to avoid this problem. Currently I'm not the email server admin and do not have access to those configurations so no test with the server has been run at this point. 