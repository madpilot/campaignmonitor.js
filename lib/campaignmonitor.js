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
