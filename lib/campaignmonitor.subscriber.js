CampaignMonitor.Subscriber = function(emailAddress, name, date, state, customFields, opts) {
  this.apiKey = CampaignMonitor.apiKey;
  this.emailAddress = emailAddress;
  this.name = name;
  this.date = date;
  this.state = state;
  this.customFields = customFields;
  this.opts = opts;
};

CampaignMonitor.Subscriber.prototype.add = function(listID, customFields, callback) {
  params = {
    'ApiKey': this.apiKey,
    'ListID': listID,
    'email': this.emailAddress,
    'name': this.name
  }

  var callback = callback || function() {};

  var soap = CampaignMonitor.soap();
  var parseResult = function(xmlDoc) {
    var result = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
    var ret = { code: null, message: null, success: false }
    
    while(res = result.iterateNext()) {
      switch(res.tagName) {
        case "Code":
          ret.code = parseInt(res.textContent);
          ret.success = (ret.code == 0);
          break;
        case "Message":
          ret.message = res.textContent;
          break;
      }
    }
    
    callback(ret);
  }

  if(customFields != null) {
    fields = [];
    for(key in customFields) {
      fields.push({ 'SubscriberCustomField': { 'Key': key, 'Value': customFields[key] } });
    }
    params['CustomFields'] = fields;
    CampaignMonitor._soap.invoke("Subscriber.AddWithCustomFields", params, parseResult);
  } else {
    CampaignMonitor._soap.invoke("Subscriber.Add", params, parseResult);
  }
};

CampaignMonitor.Subscriber.prototype.addAndResubscribe = function(listID, customFields, callback) {
  params = {
    'ApiKey': this.apiKey,
    'ListID': listID,
    'email': this.emailAddress,
    'name': this.name
  }

  var callback = callback || function() {};

  var soap = CampaignMonitor.soap();
  var parseResult = function(xmlDoc) {
    var result = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
    var ret = { code: null, message: null, success: false }
    
    while(res = result.iterateNext()) {
      switch(res.tagName) {
        case "Code":
          ret.code = parseInt(res.textContent);
          ret.success = (ret.code == 0);
          break;
        case "Message":
          ret.message = res.textContent;
          break;
      }
    }
    
    callback(ret);
  }

  if(customFields != null) {
    fields = [];
    for(key in customFields) {
      fields.push({ 'SubscriberCustomField': { 'Key': key, 'Value': customFields[key] } });
    }
    params['CustomFields'] = fields;
    CampaignMonitor._soap.invoke("Subscriber.AddAndResubscribeWithCustomFields", params, parseResult);
  } else {
    CampaignMonitor._soap.invoke("Subscriber.AddAndResubscribe", params, parseResult);
  }
};

CampaignMonitor.Subscriber.prototype.unsubscribe = function(listID, callback) {
  params = {
    'ApiKey': this.apiKey,
    'ListID': listID,
    'email': this.emailAddress
  }

  var callback = callback || function() {};

  var soap = CampaignMonitor.soap();
  var parseResult = function(xmlDoc) {
    var result = xmlDoc.evaluate('/soap:Envelope/soap:Body/*/*/*', xmlDoc, CampaignMonitor.resolver, XPathResult.ANY_TYPE, null);
    var ret = { code: null, message: null, success: false }
    
    while(res = result.iterateNext()) {
      switch(res.tagName) {
        case "Code":
          ret.code = parseInt(res.textContent);
          ret.success = (ret.code == 0);
          break;
        case "Message":
          ret.message = res.textContent;
          break;
      }
    }
    
    callback(ret);
  }

  CampaignMonitor._soap.invoke("Subscriber.Unsubscribe", params, parseResult);
};


