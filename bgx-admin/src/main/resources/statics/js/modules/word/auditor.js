$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'word/auditor/list',
        datatype: "json",
        colModel: [			
			{ label: 'aId', name: 'aId', index: 'a_id', width: 50, key: true },
			{ label: '审核人内容 ', name: 'auditingContent', index: 'auditing_content' }, 			
			{ label: '审核人 ', name: 'auditingName', index: 'auditing_name' }, 			
			{ label: '审核时间 ', name: 'auditingTime', index: 'auditing_time' }, 			
			{ label: '', name: 'infoId', index: 'info_id' }, 			
			{ label: '所属类型 ', name: 'type', index: 'type',
                formatter: function (cellvalue, options, rowObject) {
                    if (cellvalue == "1") {return "<font>发包方</font>";}
                    if (cellvalue == "2") {return "<font>发包方项目</font>";}
                    if (cellvalue == "3") {return "<font>劳务</font>";}
                    if (cellvalue == "4") {return "<font>劳务项目</font>";}
                    else{return cellvalue;}
                }
			}
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		auditor: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.auditor = {};
		},
		update: function (event) {
			var aId = getSelectedRow();
			if(aId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(aId)
		},
		saveOrUpdate: function (event) {
			var url = vm.auditor.aId == null ? "word/auditor/save" : "word/auditor/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.auditor),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var aIds = getSelectedRows();
			if(aIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "word/auditor/delete",
                    contentType: "application/json",
				    data: JSON.stringify(aIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(aId){
			$.get(baseURL + "word/auditor/info/"+aId, function(r){
                vm.auditor = r.auditor;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});