QUnit.log = function(result, message)  
{  
  if (window.console && window.console.log)  
  {  
    window.console.log(result +' :: '+ message);  
  }  
}

mockedXHR = new MockedXHR();
(function() {
  var previous = CampaignMonitor.soap;
  CampaignMonitor.soap = function() {
    s = previous();
    s.getXHR = function() {
      return mockedXHR;
    }
  };
})();
