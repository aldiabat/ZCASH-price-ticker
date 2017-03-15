//by johnerfx (MIT Licensed)
function checkTicker() {
  var ticker = new XMLHttpRequest();
	ticker.open("GET", "https://api.coinmarketcap.com/v1/ticker/", true);
	ticker.onreadystatechange = function() {
	if (ticker.readyState == 4 && ticker.status == 200) {
		var jsonresponse=JSON.parse(ticker.responseText);
		for (i=0;i<jsonresponse.length;i++) {
			if (jsonresponse[i]['id']=='zcash') {
				//chrome.extension.getBackgroundPage().console.log(window.navigator.language);
				var zcash_btc=jsonresponse[i]['price_btc'];
				var zcash_usd=jsonresponse[i]['price_usd'];
				var zcash_percent1h=jsonresponse[i]['percent_change_1h'];
				var zcash_percent24h=jsonresponse[i]['percent_change_24h'];
				var zcash_percent7d=jsonresponse[i]['percent_change_7d'];
				var zcash_marketcap=jsonresponse[i]['market_cap_usd'];
				var zcash_volume=jsonresponse[i]['24h_volume_usd'];
			}
		}
		chrome.browserAction.setBadgeText({text: parseFloat(zcash_usd).toFixed(1)});
		var lines=["ZCASH price ticker (price taken from 'www.coinmarketcap.com')\n"];
    var options = { style: 'currency', currency: 'USD'};
		lines.push("\n");
		lines.push("ZCASH "+FixIfNotNull(zcash_btc,8)+"BTC\n");
		lines.push("ZCASH "+FixIfNotNull(zcash_usd,4)+"$\n");
		lines.push("ZCASH Marketcap "+Number(zcash_marketcap).toLocaleString(window.navigator.language,options)+"\n");
		lines.push("ZCASH 24h change "+FixIfNotNull(zcash_percent24h,2)+"%\n");
		lines.push("ZCASH 24h Volume "+Number(zcash_volume).toLocaleString(window.navigator.language,options)+"\n");
		lines.push("\n");
		lines.push(Date());
		var title_lines="";
		for (j=0;j<lines.length;j++) {
			title_lines=title_lines+lines[j];
		}
		chrome.browserAction.setTitle({title:title_lines});
		}
	}
ticker.send();
}
function FixIfNotNull(variable,decimals) {
	//Function passess variable toFixed only if it is not null (edge case)
	//then returns fixed_var as string
	var fixed_var="UNAVAILABLE";
	if (variable) {
		fixed_var=parseFloat(variable).toFixed(decimals);
	}
	return fixed_var.toString()
}
chrome.browserAction.onClicked.addListener(function(activeTab)
    {
      var newURL = "http://coinmarketcap.com/currencies/zcash/";
      chrome.tabs.create({ url: newURL });
    });
window.setInterval(checkTicker, 240000); //4 minutes
checkTicker();
