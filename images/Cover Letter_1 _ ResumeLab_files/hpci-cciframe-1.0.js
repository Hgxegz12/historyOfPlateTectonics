var hpciStatus = "";
var hpciNoConflict = "";
var hpciNo3DS = "";
var hpciLogging = false;

hpciConsoleLog = function(fullMessageStr){
	if (hpciLogging) {
		console.log("hpchost :" + fullMessageStr)
	}
}

hpciDecodeComp = function(encValue){
	return decodeURIComponent(encValue);
	// return encValue;
};

hpciEncodeComp = function(plainValue){
	return encodeURIComponent(plainValue);
	// return plainValue;
};

hpciEnableLogging = function(){
	hpciLogging = true;
}

hpciDisableLogging = function(){
	hpciLogging = false;
}

hpciUrlParam = function(name, queryStr){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(queryStr);
	if (!results) { return 0; }
	return hpciDecodeComp(results[1]) || 0;
};

hpciUrlParamStr = function(name, queryStr){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(queryStr);
	if (!results) { return ""; }
	return hpciDecodeComp(results[1]) || "";
};

hpciUrlParamsAsObject = function(queryStr){
	var results = [];
	if (queryStr != null && queryStr != "") {
		var nameValuePairArray = queryStr.split("&");
		for (var pairIdx in nameValuePairArray) {
			var nameValuePair = nameValuePairArray[pairIdx];
			var eqSepIdx = nameValuePair.indexOf("=");
			if (eqSepIdx >= 0) {
				var nameStr = nameValuePair.substring(0, eqSepIdx);
				var valueEncStr = nameValuePair.substring(eqSepIdx + 1);
				var valueStr = hpciDecodeComp(valueEncStr);
				results[nameStr] = valueStr;
				hpciConsoleLog("In hpciUrlParamsAsObject nameStr:" + nameStr + "; valueStr:" + valueStr);
			}
		}
	}
	return results;
};

var hpciStatusReset = function() { 
	hpciStatus = "";
};

var hpciPageReset = function() { 
	hpciStatusReset();
	receivePINEnabled = "";
};

var hpciDisable3DS = function() { 
	hpciNo3DS = "Y";
};

var hpciAllow3DS = function() { 
	hpciNo3DS = "N";
};

var processCCTokenHPCIMsg = function() { };
processCCTokenHPCIMsg = function(e) {
	hpciConsoleLog("In processCCTokenHPCIMsg - Received Message :" + e.data);
    hpciStatus = hpciUrlParam('hpciStatus', "?" + e.data);
    if (hpciStatus == "success") {
        hpciMappedCCValue = hpciUrlParam('hpciCC', "?" + e.data);
        hpciMappedCVVValue = hpciUrlParam('hpciCVV', "?" + e.data);
        hpciCCBINValue = hpciUrlParam('hpciCCBIN', "?" + e.data);
        hpci3DSecValue = hpciUrlParam('hpci3DSec', "?" + e.data);
        if (hpci3DSecValue == "verify3dsec") {
	         if (typeof hpciSiteShow3DSecHandler!="undefined") {
	        	 hpciSiteShow3DSecHandler();
	         }
	         else {
	        	 hpciDefaultSiteShow3DSecHandler();
	         }
        }
        else if (hpci3DSecValue == "report3dsec") {
       	 hpci3DSecAuthStatus = hpciUrlParam('hpci3DSecAuthStatus', "?" + e.data);
       	 hpci3DSecAuthCAVV = hpciUrlParam('hpci3DSecAuthCAVV', "?" + e.data);
       	 hpci3DSecAuthECI = hpciUrlParam('hpci3DSecAuthECI', "?" + e.data);
       	 hpci3DSecTxnId = hpciUrlParam('hpci3DSecTxnId', "?" + e.data);
	         if (typeof hpci3DSiteSuccessHandlerV2!="undefined") {
	        	 hpci3DSiteSuccessHandlerV2(hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpci3DSecAuthStatus, hpci3DSecAuthCAVV, hpci3DSecAuthECI, hpci3DSecTxnId);
	         }
	         else if (typeof hpci3DSiteSuccessHandler!="undefined") {
	        	 hpci3DSiteSuccessHandler(hpciMappedCCValue, hpciMappedCVVValue, hpci3DSecAuthStatus, hpci3DSecAuthCAVV, hpci3DSecAuthECI, hpci3DSecTxnId);
	         }
	         else {
	        	 hpci3DDefaultSiteSuccessHandler(hpciMappedCCValue, hpciMappedCVVValue, hpci3DSecAuthStatus, hpci3DSecAuthCAVV, hpci3DSecAuthECI, hpci3DSecTxnId);
	         }
        }
        else if (hpci3DSecValue == "reportpinverify") {
       	 alert("Got hpci3DSecValue:reportpinverify");
        }
        else {
       	 if (typeof hpciSiteSuccessHandlerV2!="undefined") {
       		 hpciSiteSuccessHandlerV2(hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue);
	     }
       	 else if (typeof hpciSiteSuccessHandlerV3!="undefined") {
             hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
       		 hpciSiteSuccessHandlerV3(hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue);
	     }
       	 else if (typeof hpciSiteSuccessHandlerV4!="undefined") {
             hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
       		 hpciSiteSuccessHandlerV4(hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	     }
       	 else if (typeof hpciSiteSuccessHandlerV5!="undefined") {
             hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
             
             hpciSiteSuccessHandlerV5(hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	     }
       	 else if (typeof hpciSiteSuccessHandlerV6!="undefined") {
             hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
             
             hpciSiteSuccessHandlerV6(hpciMsgSrcFrameName, hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	     }
       	 else if (typeof hpciSiteSuccessHandlerV7!="undefined") {
             hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
             
             threeDSValuesObj = [];
             threeDSName = 'cruiseSessionId';
             threeDSValue = hpciUrlParamStr(threeDSName, "?" + e.data);
             threeDSValuesObj[threeDSName] = threeDSValue;
             
             threeDSName = 'cruiseBinStatus';
             threeDSValue = hpciUrlParamStr(threeDSName, "?" + e.data);
             threeDSValuesObj[threeDSName] = threeDSValue;
             
             threeDSName = 'threeDSOrderId';
             threeDSValue = hpciUrlParamStr(threeDSName, "?" + e.data);
             threeDSValuesObj[threeDSName] = threeDSValue;
             
             hpciSiteSuccessHandlerV7(hpciMsgSrcFrameName, hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj,
             			hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt, threeDSValuesObj);
 	     }
       	 else if (typeof hpciSiteSuccessHandlerV8!="undefined") {
             hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
             hpciCCTypeValue = hpciUrlParamStr('hpciCCType', "?" + e.data);
             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
             
             threeDSValuesObj = [];
             threeDSName = 'cruiseSessionId';
             threeDSValue = hpciUrlParamStr(threeDSName, "?" + e.data);
             threeDSValuesObj[threeDSName] = threeDSValue;
             
             threeDSName = 'cruiseBinStatus';
             threeDSValue = hpciUrlParamStr(threeDSName, "?" + e.data);
             threeDSValuesObj[threeDSName] = threeDSValue;
             
             threeDSName = 'threeDSOrderId';
             threeDSValue = hpciUrlParamStr(threeDSName, "?" + e.data);
             threeDSValuesObj[threeDSName] = threeDSValue;
             
             hpciSiteSuccessHandlerV8(hpciMsgSrcFrameName, hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj,
             			hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt, threeDSValuesObj, hpciCCTypeValue);
 	     }
       	 else if (typeof hpciSiteSuccessHandler!="undefined") {
		     hpciSiteSuccessHandler(hpciMappedCCValue, hpciMappedCVVValue);
	     }
	     else {
		     hpciDefaultSiteSuccessHandler(hpciMappedCCValue, hpciMappedCVVValue);
	     }
        }
    }
    else {
        hpciErrCode = hpciUrlParam('hpciErrCode', "?" + e.data);
        hpciErrMsgEncoded = hpciUrlParam('hpciErrMsg', "?" + e.data);
        hpciErrMsg = unescape(hpciErrMsgEncoded);
        if (typeof hpciSiteErrorHandler!="undefined") {
	    	 hpciSiteErrorHandler(hpciErrCode, hpciErrMsg);
        }
        else {
        	 if (hpciErrMsg == "0") {
        	 	hpciErrMsg = hpciErrMsg + ";loc2;ed:" + e.data + ";e:" + e + ";";
        	 }
	    	 hpciDefaultSiteErrorHandler(hpciErrCode, hpciErrMsg);
        }
    }

}

var processNonTokenHPCIMsg = function() { };
processNonTokenHPCIMsg = function(e) {
	
	 hpciConsoleLog("In processNonTokenHPCIMsg - Received Message :" + e.data);
	 
	 // make sure the message is available
	 if (typeof e == "undefined" || typeof e.data == "undefined" || !e.data) {
		 return;
	 }
	 
	 hpciRespMode = hpciUrlParam('hpciRespMode', "?" + e.data);
     hpciMsgStatus = hpciUrlParam('hpciStatus', "?" + e.data);
     
     // handle preliminary messages
     if (hpciRespMode == "ccprelim") {
    	 if (hpciMsgStatus == "success") {
    		 hpciCCTypeValue = hpciUrlParam('hpciCCType', "?" + e.data);
    		 hpciCCBINValue = hpciUrlParam('hpciCCBIN', "?" + e.data);
    		 hpciCCValidValue = hpciUrlParam('hpciCCValid', "?" + e.data);
    		 hpciCCLengthValue = hpciUrlParam('hpciCCLength', "?" + e.data);
    		 hpciCCEnteredLengthValue = hpciUrlParam('hpciCCEnteredLength', "?" + e.data);
    		     		 
    		 // alert("hpciCCTypeValue:" + hpciCCTypeValue + ";" + "hpciCCBINValue:" + hpciCCBINValue + ";" + "hpciCCValidValue:" + hpciCCValidValue + ";" + "hpciCCLengthValue:" + hpciCCLengthValue + ";");
	         if (typeof hpciCCPreliminarySuccessHandlerV6!="undefined") {
	             
	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             // hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
	             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
	             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
	             hpciCCTypeValue = hpciUrlParamStr('hpciCCType', "?" + e.data);
	             
	        	 hpciCCPreliminarySuccessHandlerV6(hpciMsgSrcFrameName, hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt, hpciCCTypeValue);
	         }
	         else if (typeof hpciCCPreliminarySuccessHandlerV5!="undefined") {
	             
	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             // hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
	             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
	             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
	             
	        	 hpciCCPreliminarySuccessHandlerV5(hpciMsgSrcFrameName, hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	         }
	         else if (typeof hpciCCPreliminarySuccessHandlerV4!="undefined") {
	             
	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             // hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
	             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
	             
	        	 hpciCCPreliminarySuccessHandlerV4(hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	         }
	         else if (typeof hpciCCPreliminarySuccessHandlerV3!="undefined") {
	             
	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             // hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	             
	        	 hpciCCPreliminarySuccessHandlerV3(hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciGtyTokenValue, hpciCCLast4Value, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	         }
	         else if (typeof hpciCCPreliminarySuccessHandlerV2!="undefined") {
	        	 hpciCCPreliminarySuccessHandlerV2(hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue);
	         }
	         else if (typeof hpciCCPreliminarySuccessHandler!="undefined") {
	        	 hpciCCPreliminarySuccessHandler(hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue);
	         }
    	 }
     }
     else if (hpciRespMode == "cvvprelim") {
    	 if (hpciMsgStatus == "success") {
    		 hpciCVVLengthValue = hpciUrlParam('hpciCVVLength', "?" + e.data);
    		 hpciCVVValidValue = hpciUrlParam('hpciCVVValid', "?" + e.data);
    		 
    		 // alert("hpciCVVLengthValue:" + hpciCVVLengthValue + ";");
	         if (typeof hpciCVVPreliminarySuccessHandlerV6!="undefined") {

	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
	             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
	             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
	             hpciCCTypeValue = hpciUrlParamStr('hpciCCType', "?" + e.data);
	             
	        	 
	        	 hpciCVVPreliminarySuccessHandlerV6(hpciMsgSrcFrameName, hpciCVVLengthValue, hpciCVVValidValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt, hpciCCTypeValue);
	         }
	         else if (typeof hpciCVVPreliminarySuccessHandlerV5!="undefined") {

	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
	             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
	             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
	        	 
	        	 hpciCVVPreliminarySuccessHandlerV5(hpciMsgSrcFrameName, hpciCVVLengthValue, hpciCVVValidValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	         }
	         else if (typeof hpciCVVPreliminarySuccessHandlerV4!="undefined") {

	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
	             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
	        	 
	        	 hpciCVVPreliminarySuccessHandlerV4(hpciCVVLengthValue, hpciCVVValidValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	         }
	         else if (typeof hpciCVVPreliminarySuccessHandlerV3!="undefined") {

	        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
	             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
	             hpciCCBINValue = hpciUrlParamStr('hpciCCBIN', "?" + e.data);
	             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
	             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
	             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
	             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
	        	 
	        	 hpciCVVPreliminarySuccessHandlerV3(hpciCVVLengthValue, hpciCVVValidValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciCCBINValue, hpciGtyTokenValue, hpciCCLast4Value, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	         }
	         else if (typeof hpciCVVPreliminarySuccessHandlerV2!="undefined") {
	        	 hpciCVVPreliminarySuccessHandlerV2(hpciCVVLengthValue, hpciCVVValidValue);
	         }
	         else if (typeof hpciCVVPreliminarySuccessHandler!="undefined") {
	        	 hpciCVVPreliminarySuccessHandler(hpciCVVLengthValue);
	         }
    	 }
     }
     else if (hpciRespMode == "gpaytoken") {
    	 if (hpciMsgStatus == "success") {
    		 hpciCCTypeValue = hpciUrlParam('hpciCCType', "?" + e.data);
    		 hpciCCBINValue = hpciUrlParam('hpciCCBIN', "?" + e.data);
    		 hpciCCValidValue = hpciUrlParam('hpciCCValid', "?" + e.data);
    		 hpciCCLengthValue = hpciUrlParam('hpciCCLength', "?" + e.data);
    		 hpciCCEnteredLengthValue = hpciUrlParam('hpciCCEnteredLength', "?" + e.data);
        	 hpciMappedCCValue = hpciUrlParamStr('hpciCC', "?" + e.data);
             hpciMappedCVVValue = hpciUrlParamStr('hpciCVV', "?" + e.data);
             hpciCCLast4Value = hpciUrlParamStr('hpciCCLast4', "?" + e.data);
             hpciGtyTokenValue = hpciUrlParamStr('hpciGtyToken', "?" + e.data);
             hpciGtyTokenAuthRespValue = hpciUrlParamStr('hpciGtyTokenAuthResp', "?" + e.data);
             hpciTokenRespEncrypt = hpciUrlParamStr('hpciTokenRespEncrypt', "?" + e.data);
             hpciReportedFormFieldsValue = hpciUrlParamStr('reportedFormFields', "?" + e.data);
             hpciReportedFormFieldsObj = hpciUrlParamsAsObject(hpciReportedFormFieldsValue);
             hpciExpMMValue = hpciUrlParamStr('hpciExpMM', "?" + e.data);
             hpciExpYYValue = hpciUrlParamStr('hpciExpYY', "?" + e.data);
             hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
 
	         if (typeof hpciGPayTokenSuccessHandlerV5!="undefined") {
	             
	        	 hpciGPayTokenSuccessHandlerV5(hpciMsgSrcFrameName, hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue,
	        			 hpciMappedCCValue, hpciMappedCVVValue, hpciGtyTokenValue, hpciCCLast4Value, hpciExpMMValue, hpciExpYYValue,
	        			 hpciReportedFormFieldsObj, hpciGtyTokenAuthRespValue, hpciTokenRespEncrypt);
	        	 
	         }
    	 }
     }
     else if (hpciRespMode == "ffprelim") {
    	 if (hpciMsgStatus == "success") {
    		 hpciFormFieldName = hpciUrlParamStr('hpciFormFieldName', "?" + e.data);
    		 hpciFormFieldValue = hpciUrlParamStr('hpciFormFieldValue', "?" + e.data);
    		 hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
	         if (typeof hpciFormFieldPreliminarySuccessHandlerV2!="undefined") {
	        	 hpciFormFieldPreliminarySuccessHandlerV2(hpciMsgSrcFrameName, hpciFormFieldName, hpciFormFieldValue);
	         }
	         else if (typeof hpciFormFieldPreliminarySuccessHandler!="undefined") {
	        	 hpciFormFieldPreliminarySuccessHandler(hpciFormFieldName, hpciFormFieldValue);
	         }
    	 }
     }
     else if (hpciRespMode == "ffkeys") {
    	 if (hpciMsgStatus == "success") {
    		 hpciFormFieldName = hpciUrlParamStr('hpciFormFieldName', "?" + e.data);
    		 hpciFormFieldValue = hpciUrlParamStr('hpciFormFieldValue', "?" + e.data);
    		 hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
	         if (typeof hpciFormFieldKeysSuccessHandlerV2!="undefined") {
	        	 hpciFormFieldKeysSuccessHandlerV2(hpciMsgSrcFrameName, hpciFormFieldName, hpciFormFieldValue);
	         }
	         else if (typeof hpciFormFieldKeysSuccessHandler!="undefined") {
	        	 hpciFormFieldKeysSuccessHandler(hpciFormFieldName, hpciFormFieldValue);
	         }
    	 }
     }
     else if (hpciRespMode == "ccdigits") {
    	 if (hpciMsgStatus == "success") {
    		 hpciCCTypeValue = hpciUrlParam('hpciCCType', "?" + e.data);
    		 hpciCCBINValue = hpciUrlParam('hpciCCBIN', "?" + e.data);
    		 hpciCCValidValue = hpciUrlParam('hpciCCValid', "?" + e.data);
    		 hpciCCLengthValue = hpciUrlParam('hpciCCLength', "?" + e.data);
    		 hpciCCEnteredLengthValue = hpciUrlParam('hpciCCEnteredLength', "?" + e.data);
    		 hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
    		 // alert("hpciCCTypeValue:" + hpciCCTypeValue + ";" + "hpciCCBINValue:" + hpciCCBINValue + ";" + "hpciCCValidValue:" + hpciCCValidValue + ";" + "hpciCCLengthValue:" + hpciCCLengthValue + ";");
	         if (typeof hpciCCDigitsSuccessHandlerV3!="undefined") {
	        	 hpciCCDigitsSuccessHandlerV3(hpciMsgSrcFrameName, hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue);
	         }
	         else if (typeof hpciCCDigitsSuccessHandlerV2!="undefined") {
	        	 hpciCCDigitsSuccessHandlerV2(hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue, hpciCCEnteredLengthValue);
	         }
	         else if (typeof hpciCCDigitsSuccessHandler!="undefined") {
	        	 hpciCCDigitsSuccessHandler(hpciCCTypeValue, hpciCCBINValue, hpciCCValidValue, hpciCCLengthValue);
	         }
    	 }
     }
     else if (hpciRespMode == "cvvdigits") {
    	 if (hpciMsgStatus == "success") {
    		 hpciCVVLengthValue = hpciUrlParam('hpciCVVLength', "?" + e.data);
    		 hpciCVVValidValue = hpciUrlParam('hpciCVVValid', "?" + e.data);
    		 hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
    		 // alert("hpciCVVLengthValue:" + hpciCVVLengthValue + ";");
	         if (typeof hpciCVVDigitsSuccessHandlerV2!="undefined") {
	        	 hpciCVVDigitsSuccessHandlerV2(hpciMsgSrcFrameName, hpciCVVLengthValue, hpciCVVValidValue);
	         }
	         else if (typeof hpciCVVDigitsSuccessHandler!="undefined") {
	        	 hpciCVVDigitsSuccessHandler(hpciCVVLengthValue, hpciCVVValidValue);
	         }
    	 }
     }
     else if (hpciRespMode == "initcomplete") {
    	 if (hpciMsgStatus == "success") {
    		 hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
    		 // alert("checking for hpciInitCompleteSuccessHandler;");
	         if (typeof hpciInitCompleteSuccessHandlerV2!="undefined") {
	        	 hpciInitCompleteSuccessHandlerV2(hpciMsgSrcFrameName);
	         }
	         else if (typeof hpciInitCompleteSuccessHandler!="undefined") {
	        	 hpciInitCompleteSuccessHandler();
	         }
    	 }
     }
     else if (hpciRespMode == "setup3ds") {
    	 if (hpciMsgStatus == "success") {
    		 hpciMsgSrcFrameName = hpciUrlParamStr('msgSrcFrame', "?" + e.data);
    		 // alert("checking for hpciInitCompleteSuccessHandler;");
	         if (typeof hpciSetup3DSSuccessHandler!="undefined") {
	        	 hpciSetup3DSSuccessHandler(hpciMsgSrcFrameName);
	         }
    	 }
    	 else {
	        hpciErrCode = hpciUrlParam('hpciErrCode', "?" + e.data);
	        hpciErrMsgEncoded = hpciUrlParam('hpciErrMsg', "?" + e.data);
	        hpciErrMsg = unescape(hpciErrMsgEncoded);
	        if (typeof hpciSiteErrorHandler!="undefined") {
		    	 hpciSiteErrorHandler(hpciErrCode, hpciErrMsg);
	        }
	        else {
	        	 if (hpciErrMsg == "0") {
	        	 	hpciErrMsg = hpciErrMsg + ";loc1;ed:" + e.data + ";e:" + e + ";";
	        	 }
		    	 hpciDefaultSiteErrorHandler(hpciErrCode, hpciErrMsg);
	        }
    	 }
     }
     else {
	     if (hpciMsgStatus == "success") {
	         hpci3DSecValue = hpciUrlParam('hpci3DSec', "?" + e.data);
	         if (hpci3DSecValue == "reportpinverify") {
	        	 // alert("Got hpci3DSecValue:reportpinverify");
		         if (typeof hpci3DSitePINSuccessHandler!="undefined") {
		        	 hpci3DSitePINSuccessHandler();
		         }
		         else {
		        	 hpci3DDefaultSitePINSuccessHandler();
		         }
	         }
	         else {
	        	 if (hpciNo3DS != "Y") {
			         if (typeof hpci3DSitePINErrorHandler!="undefined") {
			        	 hpci3DSitePINErrorHandler();
			         }
			         else {
			        	 hpci3DDefaultSitePINErrorHandler();
			         }
	        	 }
	         }
	     }
	     else {
        	 if (hpciNo3DS != "Y") {
		    	 // make sure the value type is string
		    	 if (typeof e.data == "string") {
			         if (typeof hpci3DSitePINErrorHandler!="undefined") {
			        	 hpci3DSitePINErrorHandler();
			         }
			         else {
			        	 hpci3DDefaultSitePINErrorHandler();
			         }
		    	 }
        	 }
	     }
     }
}

var sendHPCIMsg = function() { };
sendHPCIMsg = function() {
	return sendHPCIFrameMsg(hpciCCFrameName);
};

var sendHPCIFrameMsg = function() { };
sendHPCIFrameMsg = function(selFrameName) {

	// setup non Conflicting handler
	if (hpciNoConflict != "N") {
		jQuery.noConflict();
	}
	
	// setup receive message handler
	jQuery.receiveMessage(
			  function(e){
				 hpciRespMode = hpciUrlParam('hpciRespMode', "?" + e.data);
				 if (hpciRespMode == "") {
					 processCCTokenHPCIMsg(e);
				 }
				 else {
					 processNonTokenHPCIMsg(e);
				 }
			  },
			  hpciCCFrameHost
			);
	
	// find the uri
	var url = "" + window.location;
	
	// prepare full message to send/post
	var fullMsg = "";
	var msgConcat = "";
	
	// define the parameters for 3D Sec
	var defThreeDSecEnabled = false;
	if (typeof hpciThreeDSecEnabled!="undefined" && hpciThreeDSecEnabled) {
		defThreeDSecEnabled = true;
    }
	
	// define the parameters for gateway token creation
	var defGtyTokenEnabled = false;
	if (typeof hpciGtyTokenEnabled!="undefined" && hpciGtyTokenEnabled) {
		defGtyTokenEnabled = true;
    }
	
	// define the parameters for token resp encryption
	var defRequestRefEnabled = false;
	if (typeof hpciRequestRefEnabled!="undefined" && hpciRequestRefEnabled) {
		defRequestRefEnabled = true;
    }
	
	if (defThreeDSecEnabled) {
		// lookup the parameter names for 3D Sec
		var defExpMonthName = "expMonth";
		var defExpMonthValue = "";
		if (typeof hpciExpMonthName!="undefined" && hpciExpMonthName!="") {
			defExpMonthName = hpciExpMonthName;
	    }
		// find the parameter value
		var expMonthInput = document.getElementById(defExpMonthName);
		if (typeof expMonthInput!="undefined") {
			defExpMonthValue = expMonthInput.value;
	    }
		if (defExpMonthValue!="") {
			fullMsg = fullMsg + msgConcat + "expMonth=" + hpciEncodeComp(defExpMonthValue);
			msgConcat = "&";
		}
		
		// lookup year
		var defExpYearName = "expYear";
		var defExpYearValue = "";
		if (typeof hpciExpYearName!="undefined" && hpciExpYearName!="") {
			defExpYearName = hpciExpYearName;
	    }
		// find the parameter value
		var expYearInput = document.getElementById(defExpYearName);
		if (typeof expYearInput!="undefined") {
			defExpYearValue = expYearInput.value;
	    }
		if (defExpYearValue!="") {
			fullMsg = fullMsg + msgConcat + "expYear=" + hpciEncodeComp(defExpYearValue);
			msgConcat = "&";
		}
		
		// lookup message id
		var defMessageIdName = "messageId";
		var defMessageIdValue = "";
		if (typeof hpciMessageIdName!="undefined" && hpciMessageIdName!="") {
			defMessageIdName = hpciMessageIdName;
	    }
		// find the parameter value
		var messageIdInput = document.getElementById(defMessageIdName);
		if (typeof messageIdInput!="undefined") {
			defMessageIdValue = messageIdInput.value;
	    }
		if (defMessageIdValue!="") {
			fullMsg = fullMsg + msgConcat + "messageId=" + hpciEncodeComp(defMessageIdValue);
			msgConcat = "&";
		}
		
		// lookup transaction id
		var defTransactionIdName = "transactionId";
		var defTransactionIdValue = "";
		if (typeof hpciTransactionIdName!="undefined" && hpciTransactionIdName!="") {
			defTransactionIdName = hpciTransactionIdName;
	    }
		// find the parameter value
		var transactionIdInput = document.getElementById(defTransactionIdName);
		if (typeof transactionIdInput!="undefined") {
			defTransactionIdValue = transactionIdInput.value;
	    }
		if (defTransactionIdValue!="") {
			fullMsg = fullMsg + msgConcat + "transactionId=" + hpciEncodeComp(defTransactionIdValue);
			msgConcat = "&";
		}
		
		// lookup display ready transaction amount
		var defTranDispAmountName = "tranDispAmount";
		var defTranDispAmountValue = "";
		if (typeof hpciTranDispAmountName!="undefined" && hpciTranDispAmountName!="") {
			defTranDispAmountName = hpciTranDispAmountName;
	    }
		// find the parameter value
		var tranDispAmountInput = document.getElementById(defTranDispAmountName);
		if (typeof transactionIdInput!="undefined") {
			defTranDispAmountValue = tranDispAmountInput.value;
	    }
		if (defTranDispAmountValue!="") {
			fullMsg = fullMsg + msgConcat + "tranDispAmount=" + hpciEncodeComp(defTranDispAmountValue);
			msgConcat = "&";
		}
		
	}
	
	if (defGtyTokenEnabled) {
		// lookup the parameter names for tokenization
		if (!defThreeDSecEnabled) {
			var defExpMonthName = "expMonth";
			var defExpMonthValue = "";
			if (typeof hpciExpMonthName!="undefined" && hpciExpMonthName!="") {
				defExpMonthName = hpciExpMonthName;
		    }
			// find the parameter value
			var expMonthInput = document.getElementById(defExpMonthName);
			if (typeof expMonthInput!="undefined") {
				defExpMonthValue = expMonthInput.value;
		    }
			if (defExpMonthValue!="") {
				fullMsg = fullMsg + msgConcat + "expMonth=" + hpciEncodeComp(defExpMonthValue);
				msgConcat = "&";
			}
			
			// lookup year
			var defExpYearName = "expYear";
			var defExpYearValue = "";
			if (typeof hpciExpYearName!="undefined" && hpciExpYearName!="") {
				defExpYearName = hpciExpYearName;
		    }
			// find the parameter value
			var expYearInput = document.getElementById(defExpYearName);
			if (typeof expYearInput!="undefined") {
				defExpYearValue = expYearInput.value;
		    }
			if (defExpYearValue!="") {
				fullMsg = fullMsg + msgConcat + "expYear=" + hpciEncodeComp(defExpYearValue);
				msgConcat = "&";
			}
		}

		// lookup first name
		var defFirstNameName = "firstName";
		var defFirstNameValue = "";
		if (typeof hpciFirstNameName!="undefined" && hpciFirstNameName!="") {
			defFirstNameName = hpciFirstNameName;
	    }
		// find the parameter value
		var firstNameInput = document.getElementById(defFirstNameName);
		if (typeof firstNameInput!="undefined") {
			defFirstNameValue = firstNameInput.value;
	    }
		if (defFirstNameValue!="") {
			fullMsg = fullMsg + msgConcat + "firstName=" + hpciEncodeComp(defFirstNameValue);
			msgConcat = "&";
		}

		// lookup last name
		var defLastNameName = "lastName";
		var defLastNameValue = "";
		if (typeof hpciLastNameName!="undefined" && hpciLastNameName!="") {
			defLastNameName = hpciLastNameName;
	    }
		// find the parameter value
		var lastNameInput = document.getElementById(defLastNameName);
		if (typeof lastNameInput!="undefined") {
			defLastNameValue = lastNameInput.value;
	    }
		if (defLastNameValue!="") {
			fullMsg = fullMsg + msgConcat + "lastName=" + hpciEncodeComp(defLastNameValue);
			msgConcat = "&";
		}

	}

	if (defRequestRefEnabled) {
		
		// lookup HPCI request reference encryption entropy
		var defRequestRefName = "hpciRequestRef";
		var defRequestRefValue = "";
		if (typeof hpciRequestRefName!="undefined" && hpciRequestRefName!="") {
			defRequestRefName = hpciRequestRefName;
	    }
		// find the parameter value
		var requestRefInput = document.getElementById(defRequestRefName);
		if (typeof requestRefInput!="undefined") {
			defRequestRefValue = requestRefInput.value;
	    }
		if (defRequestRefValue!="") {
			fullMsg = fullMsg + msgConcat + "requestRef=" + hpciEncodeComp(defRequestRefValue);
			msgConcat = "&";
		}

	}
	
	// prepare full message to send/post
	fullMsg = fullMsg + msgConcat + "mapcc-url=" + hpciEncodeComp(url);
	if (hpciStatus != "success") {
		jQuery.postMessage(
		  fullMsg,
		  hpciCCFrameFullUrl,
		  frames[selFrameName]
		);
		return false;
	}
	else {
	    return true;
	}
	
};

var hpci3DDefaultSitePINSuccessHandler = function (){
	console.log("hpchost :** " + "Please implement hpci3DSitePINSuccessHandler function to submit form");
}

var hpci3DDefaultSitePINErrorHandler = function (){
	console.log("hpchost :** " + "Please implement hpci3DSitePINErrorHandler function to submit form");
}

var receivePINEnabled = "";
var receivePINMsg = function() { };
receivePINMsg = function() {
	receiveHPCIMsg();
};

var receiveHPCIMsgAfterPageReset = function() { };
receiveHPCIMsgAfterPageReset = function() {
	hpciPageReset();
	receiveHPCIMsg();
};

var receiveHPCIMsg = function() { };
receiveHPCIMsg = function() {
	
	if (receivePINEnabled == "Y")
		return;
	// make sure another listner is not enabled
	receivePINEnabled = "Y";

	// setup receive message handler
	jQuery.receiveMessage(
		  function(e){
			  processNonTokenHPCIMsg(e);
		  },
		  hpciCCFrameHost
		);
	
};

var sendHPCIChangeStyleMsg = function() { };
sendHPCIChangeStyleMsg = function(elementId, propName, propValue) {
    return sendHPCIChangeStyleFrameMsg(hpciCCFrameName, elementId, propName, propValue);
};

var sendHPCIChangeStyleFrameMsg = function() { };
sendHPCIChangeStyleFrameMsg = function(selFrameName, elementId, propName, propValue) {

	// setup non Conflicting handler
	if (hpciNoConflict != "N") {
		jQuery.noConflict();
	}
	
	// prepare full message to send/post
	var fullMsg = "msgCmd=changestyle&elementId=" + hpciEncodeComp(elementId) + "&propName=" + hpciEncodeComp(propName) + "&propValue=" + hpciEncodeComp(propValue);
	jQuery.postMessage(
	  fullMsg,
	  hpciCCFrameFullUrl,
	  frames[selFrameName]
	);
    return true;
	
};

var sendHPCIChangeClassMsg = function() { };
sendHPCIChangeClassMsg = function(elementId, classValue) {
	return sendHPCIChangeClassFrameMsg(hpciCCFrameName, elementId, classValue);
};

var sendHPCIChangeClassFrameMsg = function() { };
sendHPCIChangeClassFrameMsg = function(selFrameName, elementId, classValue) {

	// setup non Conflicting handler
	if (hpciNoConflict != "N") {
		jQuery.noConflict();
	}
	
	// prepare full message to send/post
	var fullMsg = "msgCmd=changeclass&elementId=" + hpciEncodeComp(elementId) + "&classValue=" + hpciEncodeComp(classValue);
	jQuery.postMessage(
	  fullMsg,
	  hpciCCFrameFullUrl,
	  frames[selFrameName]
	);
    return true;
	
};

var sendHPCIChangeTextMsg = function() { };
sendHPCIChangeTextMsg = function(elementId, textValue) {
	return sendHPCIChangeTextFrameMsg(hpciCCFrameName, elementId, textValue);
}

var sendHPCIChangeTextFrameMsg = function() { };
sendHPCIChangeTextFrameMsg = function(selFrameName, elementId, textValue) {

	// setup non Conflicting handler
	if (hpciNoConflict != "N") {
		jQuery.noConflict();
	}
	
	// prepare full message to send/post
	var fullMsg = "msgCmd=changetext&elementId=" + hpciEncodeComp(elementId) + "&textValue=" + hpciEncodeComp(textValue);
	jQuery.postMessage(
	  fullMsg,
	  hpciCCFrameFullUrl,
	  frames[selFrameName]
	);
    return true;
	
};

var sendHPCISet3DSecParamMsg = function() { };
sendHPCISet3DSecParamMsg = function(set3DSecName, set3DSecPayName, set3DSecPayCCType, set3DSecPayCurISO) {
	return sendHPCISet3DSecParamFrameMsg(hpciCCFrameName, set3DSecName, set3DSecPayName, set3DSecPayCCType, set3DSecPayCurISO);
}

var sendHPCISet3DSecParamFrameMsg = function() { };
sendHPCISet3DSecParamFrameMsg = function(selFrameName, set3DSecName, set3DSecPayName, set3DSecPayCCType, set3DSecPayCurISO) {

	// check if frame name is selected
	if (selFrameName == "") {
		return;
	}
	// setup non Conflicting handler
	if (hpciNoConflict != "N") {
		jQuery.noConflict();
	}
	
	// prepare full message to send/post
	var fullMsg = "msgCmd=set3dsec&set3DSecName=" + hpciEncodeComp(set3DSecName) 
							+ "&set3DSecPayName=" + hpciEncodeComp(set3DSecPayName)
							+ "&set3DSecPayCCType=" + hpciEncodeComp(set3DSecPayCCType)
							+ "&set3DSecPayCurISO=" + hpciEncodeComp(set3DSecPayCurISO);
	jQuery.postMessage(
	  fullMsg,
	  hpciCCFrameFullUrl,
	  frames[selFrameName]
	);
    return true;
	
};

