module("Subscriber");
test("Successful Add", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddResult><Code>0</Code><Message>Success</Message></Subscriber.AddResult></Subscriber.AddResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.add('12345', null, function(result) {
    equals(result.code, 0, "result.code");
    equals(result.message, "Success", "result.message");
    equals(result.success, true, "success");
  });
  console.log(subscriber);

  xmlDoc = mockedXHR.bodyAsXML();
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
 
  apiKey = listId = email = name = null;
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        apiKey = res.textContent;
        break;
      case 'ListID':
        listId = res.textContent;
        break;
      case 'email':
        email = res.textContent;
        break;
      case 'name':
        name = res.textContent;
        break
    }
  }
  
  equals(apiKey, 'ABCDE1234567890', 'API Key');
  equals(listId, '12345', 'List ID');
  equals(email, 'myles@madpilot.com.au', 'Email');
  equals(name, 'Myles Eftos', 'Name');
});

test("Failed Add", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddResult><Code>100</Code><Message>Invalid API Key</Message></Subscriber.AddResult></Subscriber.AddResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.add('12345', null, function(result) {
    equals(result.code, 100, "result.code");
    equals(result.message, "Invalid API Key", "result.message");
    equals(result.success, false, "success");
  });
  console.log(subscriber);

  xmlDoc = mockedXHR.bodyAsXML();
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
 
  apiKey = listId = email = name = null;
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        apiKey = res.textContent;
        break;
      case 'ListID':
        listId = res.textContent;
        break;
      case 'email':
        email = res.textContent;
        break;
      case 'name':
        name = res.textContent;
        break
    }
  }
  
  equals(apiKey, 'ABCDE1234567890', 'API Key');
  equals(listId, '12345', 'List ID');
  equals(email, 'myles@madpilot.com.au', 'Email');
  equals(name, 'Myles Eftos', 'Name');
});
