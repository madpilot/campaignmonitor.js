CampaignMonitor.Subscriber = function(emailAddress, name, date, state, customFields, opts) {
  this.apiKey = CampaignMonitor.apiKey;
  this.emailAddress = emailAddress;
  this.name = name;
  this.date = date;
  this.state = state;
  this.customFields = customFields;
  this.opts = opts;

  this.buildCustomFields = function(customFields) {
    fields = [];
    for(key in customFields) {
      fields.push({ 'SubscriberCustomField': { 'Key': key, 'Value': customFields[key] } });
    }
    return fields;
  };
};

CampaignMonitor.Subscriber.prototype.add = function(listID, customFields, callback) {
  params = {
    'ApiKey': this.apiKey,
    'ListID': listID,
    'email': this.emailAddress,
    'name': this.name
  }

  var soap = CampaignMonitor.soap();

  parseResult = function(result) { CampaignMonitor.parseResult(result, callback) };
  if(customFields != null) {
    params['CustomFields'] = this.buildCustomFields(customFields);
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

  var soap = CampaignMonitor.soap();
  parseResult = function(result) { CampaignMonitor.parseResult(result, callback) };

  if(customFields != null) {
    params['CustomFields'] = this.buildCustomFields(customFields);
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
  
  var soap = CampaignMonitor.soap();
  parseResult = function(result) { CampaignMonitor.parseResult(result, callback) };
  CampaignMonitor._soap.invoke("Subscriber.Unsubscribe", params, parseResult);
};
