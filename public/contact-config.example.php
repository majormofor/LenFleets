<?php
/**
 * TEMPLATE. Copy this to contact-config.php on the server and fill it in.
 *
 * Do NOT put real keys in this example file: it is committed to the repo and
 * ships inside the deployment zip. contact-config.php itself is gitignored.
 *
 * Create it in Hostinger's File Manager, in the same folder as contact.php
 * (or one level above public_html, which contact.php also checks and which
 * keeps it outside the web root entirely).
 */
return [
    // From resend.com -> API Keys. Starts with re_
    'RESEND_API_KEY'     => '',
    // Use onboarding@resend.dev until lensfleet.com is verified in Resend,
    // then switch to info@lensfleet.com so mail does not land in spam.
    'CONTACT_FROM_EMAIL' => 'onboarding@resend.dev',
    // Where enquiries are delivered.
    'CONTACT_TO_EMAIL'   => 'info@lensfleet.com',
];
