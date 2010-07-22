
/**
* Suds: A Lightweight JavaScript SOAP Client
* Copyright: 2009 Kevin Whinnery (http://www.kevinwhinnery.com)
* License: http://www.apache.org/licenses/LICENSE-2.0.html
* Source: http://github.com/kwhinnery/Suds
*/
function SudsClient(_options) {
  
  //A generic extend function - thanks MooTools
  function extend(original, extended) {
    for (var key in (extended || {})) {
      if (original.hasOwnProperty(key)) {
        original[key] = extended[key];
      }
    }
    return original;
  }
  
  //Check if an object is an array
  function isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  }
  
  //Grab an XMLHTTPRequest Object
  this.getXHR = function() {
    var xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    }
    else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
  }
  
  //Parse a string and create an XML DOM object
  function xmlDomFromString(_xml) {
    var xmlDoc = null;
    if (window.DOMParser) {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(_xml,"text/xml");
    }
    else {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(_xml); 
    }
    return xmlDoc;
  }
  
  // Convert a JavaScript object to an XML string - takes either an
  function convertToXml(_obj) {
    var xml = '';
    if (isArray(_obj)) {
      for (var i = 0; i < _obj.length; i++) {
        xml += convertToXml(_obj[i]);
      }
    } else {
      //For now assuming we either have an array or an object graph
      for (var key in _obj) {
        xml += '<'+key+'>';
        if (isArray(_obj[key]) || (typeof _obj[key] == 'object' && _obj[key] != null)) {
          xml += convertToXml(_obj[key]);
        }
        else {
          xml += _obj[key];
        }
        xml += '</'+key+'>';
      }
    }
    return xml;
  }
  
  // Client Configuration
  var config = extend({
    endpoint:'http://localhost',
    targetNamespace: 'http://localhost',
    envelopeBegin: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>',
    envelopeEnd: '</soap:Body></soap:Envelope>'
  },_options);
  
  // Invoke a web service
  this.invoke = function(_soapAction,_body,_callback) {    
    //Build request body 
    var body = _body;
    
    //Allow straight string input for XML body - if not, build from object
    if (typeof body !== 'string') {
      body = '<'+_soapAction+' xmlns="'+config.targetNamespace+'">';
      body += convertToXml(_body);
      body += '</'+_soapAction+'>';
    }
    
    //Build Soapaction header - if no trailing slash in namespace, need to splice one in for soap action
    var soapAction = '';
    if (config.targetNamespace.lastIndexOf('/') != config.targetNamespace.length - 1) {
      soapAction = config.targetNamespace+'/'+_soapAction;
    }
    else {
      soapAction = config.targetNamespace+_soapAction;
    }
    
    //POST XML document to service endpoint
    var xhr = this.getXHR();
    xhr.onload = function() {
      _callback.call(this, xmlDomFromString(this.responseText));
    };
    xhr.open('POST',config.endpoint);
		xhr.setRequestHeader('Content-Type', 'text/xml');
		xhr.setRequestHeader('Soapaction', soapAction);
		xhr.send(config.envelopeBegin+body+config.envelopeEnd);
  };
}
var CampaignMonitor = {
  apiKey: '',
  _soap: null,

  soap: function() {
    if(CampaignMonitor._soap == null) {
      CampaignMonitor._soap = new SudsClient({ 
        endpoint: "http://api.createsend.com/api/api.asmx",
        targetNamespace: "http://api.createsend.com/api/" 
      });
    }
    return CampaignMonitor._soap;
  },

  resolver: function(ns) {
    switch(ns) {
      case 'soap':
        return 'http://schemas.xmlsoap.org/soap/envelope/';
      default:
        null
    }
  }
};
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


