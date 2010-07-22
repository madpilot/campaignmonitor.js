MockedXHR = function() {
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

  return {
    type: null,
    url: null,
    headers: [],
    body: null,
    mockedResponse: null,

    onload: function() {},

    open: function(type, url, options) {
      this.reset();
      this.type = type;
      this.url = url;
    },
    setRequestHeader: function(header, content) {
      this.headers[header] = content;
    },
    send: function(body) {
      this.body = body;

      response = this;
      (function() {
        this.responseText = response.mockedResponse;
        response.onload.call(this);
      }());
    },
    
    bodyAsXML: function() {
      return xmlDomFromString(this.body);
    },
    
    reset: function() {
      this.type = null;
      this.url = null;
      this.headers = [];
      this.body = null;
    }
  };
};
