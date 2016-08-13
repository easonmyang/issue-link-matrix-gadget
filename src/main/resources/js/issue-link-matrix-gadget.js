/*
 * Author Eason M. Yang
 * easonmy@gmail.com
 */


function getIssueLinkTypesField(linktypeobj,gadget)
{
	var linkTypesOptions = getlinkoptions(linktypeobj);
	var field = 
		{
            userpref: "linkType",
            label: gadget.getPrefs().getMsg("issue-link-matrix-gadget.linktype"),
            description: gadget.getMsg("issue-link-matrix-gadget.linktype"),
            type: "select",
            selected: gadget.getPref("linkType"),
            options: linkTypesOptions
        }
	return field;
	
	function getlinkoptions(linktypeobj)
	{
	    var options = [];
	    for(var l in linktypeobj)
	    {
	    var inoption = {},outoption = {};
	    inoption.value= linktypeobj[l].inward;
	    inoption.label = linktypeobj[l].inward;
	    outoption.value = linktypeobj[l].outward;
	    outoption.label = linktypeobj[l].outward;
	    options.push(inoption);
	    options.push(outoption);
	    }
	    return options;
	}
}

function getLinkConditionField(gadget)
{
	var linkConditionOptions = getconditionoptions();
	var field = 
		{
            userpref: "link-condition-pref",
            label: gadget.getPrefs().getMsg("issue-link-matrix-gadget.linkcondition"),
            description: gadget.getMsg("issue-link-matrix-gadget.linkcondition"),
            type: "select",
            selected: gadget.getPref("link-condition-pref"),
            options: linkConditionOptions
        }
	return field;
}

function getconditionoptions()
{
    var options = [];
    options.push(new LinkConditionOption("1","Only check link type"));
    options.push(new LinkConditionOption("2","At lest one linked issue of type is resolved"));
    options.push(new LinkConditionOption("3","All linked issue of type is resolved"));
    return options;
    
    function LinkConditionOption(value,label)
    {
    	this.value = value;
    	this.label = label;
    }
}

function getOperationPanel(field_userPref,field,field_input_id,options,gadget)
{
    var select = AJS.$('<select class="select" id="link-matrix-'+field+'-selects"></select>');
    var supportedOptions = getSupportedOptions(options);
    
    for(var o in supportedOptions)
    {
    	select.append('<option value="'+supportedOptions[o].id+'">'+supportedOptions[o].name+'</option>');
    }
    
    select.change(function(){
    	AJS.$('#'+field_input_id).val( this.value );
    });
    
    if(gadget.getPref(field_userPref) == null || gadget.getPref(field_userPref) == "")
    {
    	select.find('option[value="'+supportedOptions[0].id+'"]').attr('selected', 'selected');
    	AJS.$('#'+field_input_id).val( supportedOptions[0].id );
    }
    else
    {
    	var saved_value = gadget.getPref(field_userPref) ;
    	
    	select.find('option[value="'+saved_value+'"]').attr('selected', 'selected');
    }
    
    return AJS.$('<div></div>').append(select);
}

function getSupportedOptions(options)
{
	var supportedOptions = [],
		supportedCustomTypes = getSupportedCustomTypes()
		supportedSystemTypes = getSupportedSystemTypes();
	
    for(var c in options)
    {
    	if(typeof options[c].schema!=='undefined' || options[c].id==='issuekey')
    	{
    		if( supportedSystemTypes[options[c].id] || supportedCustomTypes[options[c].schema.custom] )
	    	{
	    		supportedOptions.push(options[c]);
	    	}
    	}
    }
    
    function compareOptions(a,b) 
    {
	  if (a.name < b.name)
	    return -1;
	  if (a.name > b.name)
	    return 1;
	  return 0;
    }
    
    return supportedOptions.sort(compareOptions);

	function getSupportedCustomTypes()
	{
		var types = {};
		types['com.atlassian.jira.plugin.system.customfieldtypes:datepicker']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:datetime']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:float']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:multigrouppicker']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:multiselect']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:multiuserpicker']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:multiversion']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:select']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:textfield']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:url']=true;
		types['com.atlassian.jira.plugin.system.customfieldtypes:userpicker']=true;
		types['com.tempoplugin.tempo-accounts:accounts.customfield']=true;
		return types;
	}
	
	function getSupportedSystemTypes()
	{
		var types={};
		types['issuekey']=true;
		types["versions"]=true;
		types["workratio"]=true;
		types["status"]=true;
		types["environment"]=true;
		types["timeoriginalestimate"]=true;
		types["aggregatetimeestimate"]=true;
		types["fixVersions"]=true;
		types["labels"]=true;
		types["summary"]=true;				//for now
		types["resolution"]=true;
		types["security"]=true;
		types["duedate"]=true;
		types["votes"]=true;
		types["timespent"]=true;
		types["reporter"]=true;
		types["assignee"]=true;
		types["creator"]=true;
		types["priority"]=true;
		types["updated"]=true;
		types["resolutiondate"]=true;
		types["components"]=true;
		types["project"]=true;
		types["created"]=true;
		return types;
	}
}



function buildHeaderConfigField(headers_id,gadget,options)
{
	var field_userPref = headers_id + "-pref",
		field_id = headers_id + "-field-id",
		field_label = gadget.getPrefs().getMsg("issue-link-matrix-gadget."+headers_id),
		field_type = "callbackBuilder",
		field_input_id = headers_id+"-hidden-field";
	
	var field = {
        id: field_id,
        label: field_label,
        description:field_label,
        type: field_type,
        userpref: field_userPref,
        callback: function(parentDiv){			
            parentDiv
            .append(
                AJS.$("<input/>").attr({
                    id: field_input_id,
                    type: "hidden",
                    name: field_userPref			//name must match userpref
                }).val(gadget.getPref(field_userPref))
            )
            .after(
            	AJS.$('<div></div>')
            	.append(
            	getOperationPanel(field_userPref, headers_id,field_input_id,options,gadget)
            	)
            	.append(
            	AJS.$('<table class="link-matrix-headers-table"><tbody id="link-matrix-'+headers_id+'-summary-tbody"></tbody></table>')
            	)
            );
        }
    }
	return field;
}




/**
 * fetch data from JIRA filter provided.
 * 
 */


var resultissues = [];
var datatable = {};
var resolutionmap={};

function buildMatrix(columnHeaders,rowHeaders,linkType,linkCondition, filterId,gadget)
{	
	resultissues = [];
	datatable = {};
	resolutionmap={};

//	console.log("got filterid:"+filterId);
//	console.log('columnHeaders_id :'+columnHeaders);
//	console.log('rowHeaders :'+rowHeaders);
//	console.log('linkType :'+linkType);
//	console.log("LINK CONDITION: "+linkCondition);
	
	var container = AJS.$('<div style="width: 100%; min-height:400px; overflow-x: scroll"></div>');

	process(filterId,rowHeaders,columnHeaders,linkType,Number(linkCondition),container,gadget);
}


function process(filterId,rowHeaders,columnHeaders,linktype,linkCondition,container,gadget)
{
	var fieldsParameters = "fields=issuelinks,issuetype,"+rowHeaders+','+columnHeaders;	
	var default_no_value = "[-No Value-]";
	
	getAllIssuesFromFilter(filterId,fieldsParameters );

	function printLog(msg)
	{
		//console.log(msg)
	}
	/**
	 * runs jql and get issues 100 per run
	 */
	function getAllIssuesFromFilter(filterid,fieldsParameters)
	{
	  AJS.$.ajax({
		  url: '/rest/api/latest/filter/'+filterid,
		  type: 'get',
		  contentType: 'application/json',
		  success: function(data){
			  	gadgets.window.setTitle("Issue Matrix: "+data.name);
			    getIssues(data.searchUrl+'&'+fieldsParameters+"&maxResults=100",0); 
				}
		  });
	    function getIssues(searchUrl,startAt)
	    {
	    // console.log('requesting:'+searchUrl+',startAt:'+startAt);
	     AJS.$.ajax({
	    		 url: searchUrl+"&startAt="+startAt,
	    		 type: 'get',
				 contentType: 'application/json',
	    		 success: function(data){
				             for(var i in data.issues)
				             {
				            	 resultissues.push(data.issues[i]);
				             }
				             if( (data.startAt +data.maxResults) < data.total && data.issues.length!=0)
				             {
				            	 var nextStart = data.startAt + data.maxResults;
				            	 getIssues(searchUrl,nextStart);
				             }
				             else
				             {
				            	 printLog("resultissues total:"+resultissues.length);
				            	 buildDataObject(resultissues);
				             }
						    }
	     		});
	    }
	}
	
	function buildDataObject(issues)
	{
		for (var i in issues )
		{
			printLog('Issue : '+issues[i].key);
			var rowHeaderValue = getFieldValue(issues[i],rowHeaders),
				columnHeaderValue = getFieldValue(issues[i],columnHeaders);
			
			if(columnHeaderValue instanceof Array)
			{
				mergeColumnArray(rowHeaderValue,columnHeaderValue,issues[i].fields.issuelinks,issues[i].key);
			}
			else if(rowHeaderValue instanceof Array)
			{
				mergetRowArray(rowHeaderValue,columnHeaderValue,issues[i].fields.issuelinks,issues[i].key);
			}
			else
			{
				mergeRecord(rowHeaderValue,columnHeaderValue,issues[i].fields.issuelinks,issues[i].key);
			}
		}
		
		buildResolutionMap();

		/**
		 * gets the text value of field on issue
		 */
		function getFieldValue(issue,field)
		{
			try
			{
				if(field==='issuekey' || field==='key')
				{
					return issue['key'];
				}
				var fieldNode = issue.fields[field];
				
				if(typeof fieldNode === 'undefined')
				{
					return "[-Field Not Found-]";
				}
				else if(fieldNode === null)
				{
					return default_no_value;
				}
				else if(typeof fieldNode ==='string' || typeof fieldNode ==='number')
				{
					return fieldNode;
				}
				else if(fieldNode instanceof Array)
				{
					if(fieldNode.length===0)
					{
						return default_no_value;
					}
					else
					{
						return fieldNode;	
					}
				}
				else
				{
					if(fieldNode.value == null)
					{
						return fieldNode.displayName == null ? fieldNode.name : fieldNode.displayName;
					}
					return fieldNode.value;
				}
			}
			catch(err)
			{
				console.log("Exception: "+err.message)
				return null;
			}
		}
		
		function mergetRowArray(rowArray,columnHeaderValue,links,key)
		{
			if(columnHeaderValue instanceof Array)
			{
				mergeHeaderArrays(rowArray,columnHeaderValue,links);
			}
			else
			{
				for(var r in rowArray)
				{
					if(typeof rowArray[r]==="string")
					{
						var value = rowArray[r].length === 0 ? default_no_value : rowArray[r];
						mergeRecord(value,columnHeaderValue,links,key);
					}
					else
					{
						if(rowArray[r].value!=null)
						{
							mergeRecord(rowArray[r].value,columnHeaderValue,links,key);
						}
						else
						{
							mergeRecord(rowArray[r].name,columnHeaderValue,links,key);
						}
					}
				}
			}
		}
		
		function mergeColumnArray(rowHeaderValue,columnArray,links,key)
		{
			if(rowHeaderValue instanceof Array)
			{
				mergeHeaderArrays(rowHeaderValue,columnArray,links);
			}
			else
			{
				for(var c in columnArray)
				{
					if(typeof columnArray[c]==="string")
					{
						var value = columnArray[c].length === 0 ? default_no_value : columnArray[c];
						mergeRecord(rowHeaderValue,value,links,key);
					}
					else
					{
						if(columnArray[c].value!=null)
						{
							mergeRecord(rowHeaderValue,columnArray[c].value,links,key);
						}
						else
						{
							mergeRecord(rowHeaderValue,columnArray[c].name,links,key);
						}
					}
				}
			}
		}
		
		function mergeHeaderArrays(rowArray,columnArray,links,key)
		{
			for(var r in rowArray)
			{
				for(var c in columnArray)
				{
					var rowValue, columnValue;
					
					if(typeof rowArray[r]==="string")
					{
						rowValue = rowArray[r].length === 0 ? default_no_value : rowArray[r];
					}
					else
					{
						rowValue = rowArray[r].value==null ? rowArray[r].name : rowArray[r].value;
					}
					
					if(typeof columnArray[c]==="string")
					{
						columnValue = columnArray[c].length === 0 ? default_no_value : columnArray[c];
					}
					else
					{
						columnValue = columnArray[c].value==null ? columnArray[c].name : columnArray[c].value;
					}
					
					mergeRecord(rowValue,columnValue,links,key);
				}
			}
		}
		
		/**
		 * populate datatable
		 */
		function mergeRecord(rowHeaderValue,columnHeaderValue,links,key)
		{
			if(datatable[rowHeaderValue]!=null)
			{
				var columnObject = datatable[rowHeaderValue][columnHeaderValue];
				
				if(columnObject == null)
				{
					datatable[rowHeaderValue][columnHeaderValue]={};
				}
			}
			else
			{
				datatable[rowHeaderValue]={};
				datatable[rowHeaderValue][columnHeaderValue]={};
			}
			
			saveLinkedIssues(datatable[rowHeaderValue][columnHeaderValue],links);
			saveIssueKey(datatable[rowHeaderValue][columnHeaderValue],key);
			
			
			function saveIssueKey(columnObject,key)
			{
				if(columnObject.issuekeys==null)
				{
					columnObject.issuekeys={};
				}
				columnObject.issuekeys[key]=true;
			}
			
			/**
			 * puts linked issues' keys of [linktype] onto columnObject 
			 */
			function saveLinkedIssues(columnObject,links)
			{
				if(columnObject.linkedkeys==null)
				{
					columnObject.linkedkeys={};
				}
				
				for(var index in links)
				{
					if(links[index].type.inward === linktype)
					{
						if(typeof links[index].inwardIssue !== 'undefined')
						{
							columnObject.linkedkeys[links[index].inwardIssue.key]=false;
							resolutionmap[links[index].inwardIssue.key]=false;
							printLog(linktype+' '+links[index].inwardIssue.key);
						}
					}
					else if(links[index].type.outward === linktype)
					{
						if(typeof links[index].outwardIssue !== 'undefined')
						{
							columnObject.linkedkeys[links[index].outwardIssue.key]=false;
							resolutionmap[links[index].outwardIssue.key]=false;
							printLog(linktype+' '+links[index].outwardIssue.key);
						}
					}
				}
			}
		}
		
		function buildResolutionMap()
		{
			var keys = Object.keys(resolutionmap);
			if(linkCondition===1)
			{
				buildResultMatrix();
				return;
			}
			else
			{
				checkResolution(keys, 0);
				return;
			}
		}
		/**
		 * checks issue link, produce cell color and linked keys
		 */
		function checkResolution(keys, index)
		{
			if(keys.length <= index)
			{
				buildResultMatrix();
				return;
			}
			var issuekey = keys[index];
			AJS.$.ajax({
				  url: '/rest/api/latest/issue/'+issuekey+"?fields=resolution",
				  type: 'get',
				  contentType: 'application/json',
				  success: function(data){
					    printLog(issuekey+":");
					    if(data.fields==null)
					    {
					    	printLog("Resolution Field not available.")
					    	resolutionmap[issuekey] = false;
					    }
					    else
					    {
					    	resolutionmap[issuekey] = (data.fields.resolution !== null);
					    }
					    
					    checkResolution(keys, index+1);
						}
				  });
		}
		
		function buildResultMatrix()
		{
			var sortedColumnHeaders = getSortedColumnHeaders(),
				sortedRowHeaders = Object.keys(datatable).sort();
			
			var table = AJS.$('<table id="issue-link-matrix-table"></table>');
			var thead = buildHeaderRow(sortedColumnHeaders);
			var tbody= buildTableBody(sortedRowHeaders,sortedColumnHeaders);
			
			table.append(thead).append(tbody);
			
			container.append(table);
			gadget.getView().html(container);
			gadget.resize();

			/**
			 * first row of table
			 */
			function buildHeaderRow(sortedColumnHeaders)
			{
				var linkOptions = getconditionoptions();
				var linkOption_text = linkOptions[linkCondition-1].label;
				var thead = AJS.$('<thead></thead>');
				
				var columnHead = AJS.$('<tr></tr>').append(AJS.$('<th class="link-type-header">'+'<p class="title"><strong>Link Type: </strong></p><p>'+linktype+'</p>'+'<p class="title"><strong>Condition: </strong></p><p>'+linkOption_text+'</p></th>'));
				
				for(var c in sortedColumnHeaders)
				{
					columnHead.append(
							AJS.$('<th class="table-column-header column-headers"></th>').append( rotatedSpan(sortedColumnHeaders[c]) ) 
						);
				}
				return thead.append(columnHead);
			}
			
			/**
			 * builds tbody
			 */
			function buildTableBody(sortedRowHeaders,sortedColumnHeaders)
			{
				var tbody= AJS.$('<tbody></tbody>');
				
				for(var r in sortedRowHeaders)
				{
					var tr = AJS.$('<tr></tr>').append('<td class="table-row-headers row-headers">'+sortedRowHeaders[r]+'</td>');
					
					for(var c in sortedColumnHeaders)
					{
						var td = buildMatrixCell(sortedRowHeaders[r],sortedColumnHeaders[c]);

						tr.append(td);
					}
					tbody.append(tr);
				}
				return tbody;
			}
			
			/**
			 * builds td
			 */
			function buildMatrixCell(rowHeader,columnHeader)
			{
				var td = AJS.$('<td class="not-applicable"></td>');
				var linkedIssueKeys = getLinkedIssueKeys(datatable,rowHeader,columnHeader);
				var filterIssueKeys = getFilterIssueKeys(datatable,rowHeader,columnHeader);
				
				if(linkedIssueKeys == null || linkedIssueKeys==null)
				{
					return td;
				}
				else
				{
					td = buildColoredCell(filterIssueKeys,linkedIssueKeys,linkCondition);
					td.addClass('link-maxtrix-active-node');
					AJS.InlineDialog(td, "cell-dialog",
							function(content, trigger, showPopup) {
							    var inline_dialog = buildInlineDialog(rowHeader,columnHeader,td.attr('resolved'),td.attr('unresolved') );
							    content.css({"padding":"20px"}).html(inline_dialog);
								showPopup();
								return false;
							    }
							);
					return td;
				}
				
				/**
				 * builds the inline dialog
				 */
				function buildInlineDialog(rowHeader,columnHeader,resolved,unresolved)
				{
					var resolved_array = resolved.split(","),
						unresolved_array = unresolved.split(",");

					var inline_dialog = AJS.$('<div></div>'),
						title_p = AJS.$('<p class="title"><strong>[ '+rowHeader+' : '+columnHeader+' ]</strong></p>');
					
					inline_dialog.append(title_p);
					
					if(linkCondition === 1 )	//if only check link type
					{
						if(unresolved.length > 0)
						{
							inline_dialog.append( buildReportP(linktype,unresolved,unresolved_array) );
						}
					}
					else
					{
						if(resolved.length > 0)
						{
							inline_dialog.append( buildReportP('Resolved',resolved,resolved_array) );
						}
						
						if(unresolved.length > 0)
						{
							inline_dialog.append( buildReportP('Unresolved',unresolved,unresolved_array) );
						}
					}
					
					return inline_dialog;
					
					function buildReportP(title,keys,keys_array)
					{
						var div = AJS.$('<div></div>');
						var p = AJS.$(
								'<p class="title">'+
						        '<strong>'+title+' : '+buildIssueNavigatorLink(keys)+'</strong>'+
						        '</p>'
						        );
						div.append(p);
						div.append(buildLinkResults(keys_array));
						//p.after(buildLinkResults(keys_array));
						
						return div;
					}
					    
					function buildIssueNavigatorLink(keys)
					{
						return '<a href="/secure/IssueNavigator!executeAdvanced.jspa?reset=true&jqlQuery=key in('+keys+')" target="_blank">View In Issue Navigator</a>';
					} 
					
					function buildLinkResults(linked_array)
					{
						var p = AJS.$('<p></p>');
						for(var l in linked_array)
						{
							p.append(AJS.$('<a href="/browse/'+linked_array[l]+'" target="_blank"> '+linked_array[l]+', </a>'));
						}
						return p;
					}
				}
			}
			
			function buildColoredCell(issuekeys,linkedkeys,condition)
			{
				var result = getCoveredKeys(linkedkeys,condition);
				
				return AJS.$('<td class="'+result.covered+'" resolved="'+result.resolved.join(',')+'" unresolved="'+result.unresolved.join(',')+'"></td>');
				
				function getCoveredKeys(linkedkeys,condition)
				{
					var result = {};
					var resolved=[],unresolved=[];
					
					for(var k in linkedkeys)
					{
						if(resolutionmap[linkedkeys[k]])
						{
							resolved.push(linkedkeys[k]);
						}
						else
						{
							unresolved.push(linkedkeys[k]);
						}
					}
					result['resolved'] = resolved;
					result['unresolved'] = unresolved;
					
					if(condition === 2)								//if at least one is resolved.
					{
						result['covered'] = resolved.length > 0 ? "covered" : "not-covered";
					}
					else if(condition === 3)						//if all resolved.
					{
						if(unresolved.length ==0 && resolved.length == 0)
						{
							result['covered'] = "not-covered";
						}
						else
						{
							result['covered'] = unresolved.length > 0 ? "not-covered" : "covered";
						}
					}
					else											//condition = 1 or err
					{
						result['covered'] = linkedkeys.length > 0 ? "covered" : "not-covered";											
					}
					
					return result;
				}
			}
			
			/**
			 * get the issue keys in filter identified by this matrix cell
			 */
			function getFilterIssueKeys(datatable,rowHeader,columnHeader)
			{
				try
				{
					return Object.keys(datatable[rowHeader][columnHeader].issuekeys);
				}
				catch(err)
				{
					return null;
				}
				
			}
			
			/**
			 * get linked issue keys identified by this matrix cell
			 */
			function getLinkedIssueKeys(datatable,rowHeader,columnHeader)
			{
				try
				{
					var keys = datatable[rowHeader][columnHeader].linkedkeys;
					
					if(keys!=null)
					{
						return Object.keys(keys);		//has entry, has keys , check condition
					}
					else
					{
						return "";					//has entry, no keys, red
					}
				}
				catch(err)
				{
					return null;					//no entry,	not applicable.
				}
			}
			
			/**
			 * return sorted column headers
			 */
			function getSortedColumnHeaders()
			{
				var temp_columnHeaders={};
				for(var row in datatable)
				{
					for(var col in datatable[row] )
					{
						temp_columnHeaders[col]=null;
					}
				}
				return Object.keys(temp_columnHeaders).sort();
			}
			
			/**
			 * header text
			 * @param text
			 * @returns
			 */
			function rotatedSpan(text)
			{
				return AJS.$('<div class="link-maxtrix-vertical-text"><div class="link-maxtrix-vertical-text-inner">'+text+'</div></div>');
			}
		}
	}
}

















