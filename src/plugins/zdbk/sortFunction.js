var k=0;//用来修改首次排序默认是升序还是降序
export var tableState;//用来判断是升序还是降序
/**//**************************************************************************
排序的主方法，有三个形参，STableTd,iCol,sDataType分别为需要排序的表格的tbody的id，
需要排序的表格列号，所在列的数据类型（支持int,float,date,string四种数据类型)

改编注：如所要排序的是体育课程中的篮球且按评分排序，那么调用时应该是sortTable('tbody_PPAE0018G_1',2,'float')。
iCol: 2-评分，4-学期，5-时间，6-地点，10-国际化，12-余量，14-所有待定人数。
（但是时间用中文字符串比较，目前来看大致是周四>周五>周二>周三>周一,同一天的课程大小排序正确）
**************************************************************************/
export async function sortFunction(code,iCol,sDataType)
{

    var oTbody=document.getElementById(code); //获取表格的tbody
	//console.log(oTbody);
    var colDataRows=oTbody.rows; //获取tbody里的所有行的引用, 注意rows从tBodies[0]中取
    //console.log(colDataRows);

    var aTRs=new Array(); //定义aTRs数组用于存放tbody里的行
    for(var i=0;i<colDataRows.length;i++)  //依次把所有行放如aTRs数组
    {
        aTRs.push(colDataRows[i]);
    }
    /**//***********************************************************************
    sortCol属性是额外给table添加的属性，用于作顺反两种顺序排序时的判断，区分
    首次排序和后面的有序反转
    ************************************************************************/
    if(oTbody.sortCol==iCol)  //非首次排序
    {
        aTRs.reverse();
        tableState = -tableState;
    }
    else    //首次排序
    {
        if(k%2==1)  //升序
        {
            aTRs.sort(generateCompareTRs(iCol,sDataType));
            tableState = 1;
        }
        else if(k%2==0) //降序
        {
            aTRs.sort(generateCompareTRs1(iCol,sDataType));
            tableState = -1;
        }
    }

    var oFragment=document.createDocumentFragment();    //创建文档碎片
    for(var i=0;i<aTRs.length;i++)   //把排序过的aTRs数组成员依次添加到文档碎片, 注意是tr是引用的, 所以相当直接把页面的tr拿走,加到了oFragment中
    {
        oFragment.appendChild(aTRs[i]);
    }
    oTbody.appendChild(oFragment);  //把文档碎片添加到tbody,完成排序后的显示更新 
    oTbody.sortCol=iCol;    //把当前列号赋值给sortCol,以此来区分首次排序和非首次排序,//sortCol的默认值为-1
};

//比较函数，用于两项之间的排序
//升序
function generateCompareTRs(iCol,sDataType)
{
    return   function compareTRs(oTR1,oTR2)
    {
        var vValue1=convert(oTR1.cells[iCol].innerText,sDataType);
        var vValue2=convert(oTR2.cells[iCol].innerText,sDataType);
        if(vValue1<vValue2)
        {
            return -1;
        }
        else if(vValue1>vValue2)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    };
};

//降序
function generateCompareTRs1(iCol,sDataType)
{
    return   function compareTRs(oTR1,oTR2)
    {	
	try{
        var vValue1=convert(oTR1.cells[iCol].innerText,sDataType);
	}
	catch (err){
		vValue1=0;
	}
	try{
        var vValue2=convert(oTR2.cells[iCol].innerText,sDataType);
	}
	catch (err){
		vValue2=0;
	}
        if(vValue1>vValue2)
        {
            return -1;
        }
        else if(vValue1<vValue2)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    };
};

//数据类型转换函数
function convert(sValue,sDataType)
{
    switch(sDataType)
    {
        case "int":return parseInt(sValue);
        case "float": return parseFloat(sValue);
        case "date":return new Date(Date.parse(sValue));
        default:return sValue.toString();
    }
};
