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

  xmlDoc = mockedXHR.bodyAsXML();
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.Add", "Remote Method called");
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'SubscriberCustomField':
        break;
    }
  }
  
  expect(8);
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

  xmlDoc = mockedXHR.bodyAsXML();
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.Add", "Remote Method called");
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'SubscriberCustomField':
        break;
    }
  }
  expect(8);
});

test("Successful Add With Custom Fields", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddWithCustomFieldsResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddWithCustomFieldsResult><Code>0</Code><Message>Success</Message></Subscriber.AddWithCustomFieldsResult></Subscriber.AddWithCustomFieldsResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.add('12345', { 'Suburb': 'Mt Lawley' }, function(result) {
    equals(result.code, 0, "result.code");
    equals(result.message, "Success", "result.message");
    equals(result.success, true, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.AddWithCustomFields", "Remote Method called");
 
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'CustomFields':
        for(var i = 0; i < res.childNodes.length; i++) {
          equals(res.tagName, 'CustomFields', 'Have a Custom Field element');
          cus = res.childNodes[i];
          
          for(var j = 0; j < cus.childNodes.length; j++) {
            cus2 = cus.childNodes[j];
            switch(cus2.tagName) {
              case 'Key':
                equals(cus2.textContent, 'Suburb', 'Custom Field Key');
                break;
              case 'Value':
                equals(cus2.textContent, 'Mt Lawley', 'Custom Field Value');
                break;
            }
          }
        }
        break;
    }
  }
  expect(11);
});

test("Failed Add With Customer Fields", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddWithCustomFieldsResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddWithCustomFieldsResult><Code>101</Code><Message>Invalid ListID</Message></Subscriber.AddWithCustomFieldsResult></Subscriber.AddWithCustomFieldsResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.add('12345', { 'Suburb': 'Mt Lawley', 'State': 'WA' }, function(result) {
    equals(result.code, 101, "result.code");
    equals(result.message, "Invalid ListID", "result.message");
    equals(result.success, false, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.AddWithCustomFields", "Remote Method called");
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
 
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'CustomFields':
        cus = res.childNodes[0];
        
        for(var i = 0; i < cus.childNodes.length; i++) {
          cus2 = cus.childNodes[i];
          switch(cus2.tagName) {
            case 'Key':
              equals(cus2.textContent, 'Suburb', 'Custom Field Key');
              break;
            case 'Value':
              equals(cus2.textContent, 'Mt Lawley', 'Custom Field Value');
              break;
          }
        }
        
        cus = res.childNodes[1];
        for(var i = 0; i < cus.childNodes.length; i++) {
          cus2 = cus.childNodes[i];
          switch(cus2.tagName) {
            case 'Key':
              equals(cus2.textContent, 'State', 'Custom Field Key');
              break;
            case 'Value':
              equals(cus2.textContent, 'WA', 'Custom Field Value');
              break;
          }
        }
    }
  }
  expect(12);
});

test("Successful AddAndResubscribe", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddAndResubscribeResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddAndResubscribeResult><Code>0</Code><Message>Success</Message></Subscriber.AddAndResubscribeResult></Subscriber.AddAndResubscribeResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.addAndResubscribe('12345', null, function(result) {
    equals(result.code, 0, "result.code");
    equals(result.message, "Success", "result.message");
    equals(result.success, true, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.AddAndResubscribe", "Remote Method called");
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'SubscriberCustomField':
        break;
    }
  }
  
  expect(8);
});

test("Failed AddAndResubscribe", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddAndResubscribeResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddAndResubscribeResult><Code>100</Code><Message>Invalid API Key</Message></Subscriber.AddAndResubscribeResult></Subscriber.AddAndResubscribeResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.addAndResubscribe('12345', null, function(result) {
    equals(result.code, 100, "result.code");
    equals(result.message, "Invalid API Key", "result.message");
    equals(result.success, false, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.AddAndResubscribe", "Remote Method called");
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'SubscriberCustomField':
        break;
    }
  }
  expect(8);
});

test("Successful AddAndResubscribe With Custom Fields", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddAndResubscribeWithCustomFieldsResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddAndResubscribeWithCustomFieldsResult><Code>0</Code><Message>Success</Message></Subscriber.AddAndResubscribeWithCustomFieldsResult></Subscriber.AddAndResubscribeWithCustomFieldsResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.addAndResubscribe('12345', { 'Suburb': 'Mt Lawley' }, function(result) {
    equals(result.code, 0, "result.code");
    equals(result.message, "Success", "result.message");
    equals(result.success, true, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.AddAndResubscribeWithCustomFields", "Remote Method called");
 
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'CustomFields':
        for(var i = 0; i < res.childNodes.length; i++) {
          equals(res.tagName, 'CustomFields', 'Have a Custom Field element');
          cus = res.childNodes[i];
          
          for(var j = 0; j < cus.childNodes.length; j++) {
            cus2 = cus.childNodes[j];
            switch(cus2.tagName) {
              case 'Key':
                equals(cus2.textContent, 'Suburb', 'Custom Field Key');
                break;
              case 'Value':
                equals(cus2.textContent, 'Mt Lawley', 'Custom Field Value');
                break;
            }
          }
        }
        break;
    }
  }
  expect(11);
});

test("Failed AddAndResubscribe With Customer Fields", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.AddAndResubscribeWithCustomFieldsResponse xmlns="http://api.createsend.com/api/"><Subscriber.AddAndResubscribeWithCustomFieldsResult><Code>101</Code><Message>Invalid ListID</Message></Subscriber.AddAndResubscribeWithCustomFieldsResult></Subscriber.AddAndResubscribeWithCustomFieldsResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.addAndResubscribe('12345', { 'Suburb': 'Mt Lawley', 'State': 'WA' }, function(result) {
    equals(result.code, 101, "result.code");
    equals(result.message, "Invalid ListID", "result.message");
    equals(result.success, false, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.AddAndResubscribeWithCustomFields", "Remote Method called");
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
 
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
      case 'name':
        equals(res.textContent, 'Myles Eftos', 'Name');
        break
      case 'CustomFields':
        cus = res.childNodes[0];
        
        for(var i = 0; i < cus.childNodes.length; i++) {
          cus2 = cus.childNodes[i];
          switch(cus2.tagName) {
            case 'Key':
              equals(cus2.textContent, 'Suburb', 'Custom Field Key');
              break;
            case 'Value':
              equals(cus2.textContent, 'Mt Lawley', 'Custom Field Value');
              break;
          }
        }
        
        cus = res.childNodes[1];
        for(var i = 0; i < cus.childNodes.length; i++) {
          cus2 = cus.childNodes[i];
          switch(cus2.tagName) {
            case 'Key':
              equals(cus2.textContent, 'State', 'Custom Field Key');
              break;
            case 'Value':
              equals(cus2.textContent, 'WA', 'Custom Field Value');
              break;
          }
        }
    }
  }
  expect(12);
});

test("Successful Unsubscribe", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.UnsubscribeResponse xmlns="http://api.createsend.com/api/"><Subscriber.UnsubscribeResult><Code>0</Code><Message>Success</Message></Subscriber.UnsubscribeResult></Subscriber.UnsubscribeResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.unsubscribe('12345', function(result) {
    equals(result.code, 0, "result.code");
    equals(result.message, "Success", "result.message");
    equals(result.success, true, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.Unsubscribe", "Remote Method called");
  
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
    }
  }
  
  expect(7);
});

test("Failed Unsubscribe", function() {
  mockedXHR.mockedResponse = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Subscriber.UnsubscribeResponse xmlns="http://api.createsend.com/api/"><Subscriber.UnsubscribeResult><Code>100</Code><Message>Invalid API Key</Message></Subscriber.UnsubscribeResult></Subscriber.UnsubscribeResponse></soap:Body></soap:Envelope>';
  CampaignMonitor.apiKey = 'ABCDE1234567890';

  subscriber = new CampaignMonitor.Subscriber('myles@madpilot.com.au', 'Myles Eftos');
  subscriber.unsubscribe('12345', function(result) {
    equals(result.code, 100, "result.code");
    equals(result.message, "Invalid API Key", "result.message");
    equals(result.success, false, "success");
  });

  xmlDoc = mockedXHR.bodyAsXML();
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  equals(body.iterateNext().tagName, "Subscriber.Unsubscribe", "Remote Method called");
  body = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
  while(res = body.iterateNext()) {
    switch(res.tagName) {
      case 'ApiKey':
        equals(res.textContent, 'ABCDE1234567890', 'API Key');
        break;
      case 'ListID':
        equals(res.textContent, '12345', 'List ID');
        break;
      case 'email':
        equals(res.textContent, 'myles@madpilot.com.au', 'Email');
        break;
    }
  }
  expect(7);
});


