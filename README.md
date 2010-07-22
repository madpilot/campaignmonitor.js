# campaign_monitor.js: A JavaScript implementation of the Campaign Monitor SOAP API

This library allows you to talk to the Campaign Monitor SOAP API via JavaScript. This makes little sense for regular browsers due to cross domain restrictions,
however it is useful for applications that use JavaScript as an interpreter, such as PhoneGap or App Accelerator.

It uses (and bundles a slightly modified version of) Suds: http://github.com/kwhinnery/Suds

It is heavily based on the campaigning Ruby gem: http://github.com/gnumarcelo/campaigning

## Setup

If you just wish to use the library, include http://github.com/madpilot/campaignmonitor.js/raw/master/build/campaignmonitor.min.js in you application

If you want to help with development, fork this repo, and get coding.

## Usage
 
    CampaignMonitor.apiKey = 'ABCDE1234567890';
    subscriber = new CampaignMonitor.Subscriber('jon@my-email.com', 'Jon Smith');
    var listId = 54321;
    subscriber.add(listId, null, function(result) {
      if(result.success) {
        alert('Subscribed!');
      } else {
        alert(result.message);
      }
    });

## Todo

Implement more of the API, finish documentation. Come back later, or get forking!
