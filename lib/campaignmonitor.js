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
  },

  parseResult: function(xmlDoc, callback) {
    var callback = callback || function() {};

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
};
