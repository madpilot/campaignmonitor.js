# campaign_monitor.js: A JavaScript implementation of the Campaign Monitor SOAP API

This library allows you to talk to the Campaign Monitor SOAP API via JavaScript. This makes little sense for regular browsers due to cross domain restrictions,
however it is useful for applications that use JavaScript as an interpreter, such as PhoneGap or App Accelerator.

It uses (and bundles a slightly modified version of) Suds: http://github.com/kwhinnery/Suds

It is heavily based on the campaigning Ruby gem: http://github.com/gnumarcelo/campaigning

# # Usage
 
  CampaignMonitor.apiKey = 'ABCDE1234567890';
  subscriber = new CampaignMonitor.Subscriber('jon@my-email.com', 'Jon Smith');
  var listId = 54321;
  subscriber.add(listId);

# # Todo

Implement more of the API, finish documentation. Come back later, or get forking!
