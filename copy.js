// function combine(arr, k) {
//
//     let res = []
//
//     function dfs(curr, start) {
//
//         if (curr.length === k) {
//             res.push([...curr])
//             return;
//         }
//
//         for (let i = start; i < arr.length; i++) {
//             curr.push(arr[i])
//             dfs(curr, i + 1);
//             curr.pop()
//         }
//     }
//
//     dfs([], 0)
//     return res;
// }
//
//
// console.log(combine([1, 2, 3], 2));


// function permute(arr) {
//     let res = []
//     let stack = [];
//     let visited = [false, false, false]
//
//     function dfs(arr, visited, stack) {
//
//         if (stack.length === arr.length) {
//             res.push([...stack])
//             return;
//         }
//
//
//         for (let i = 0; i < arr.length; i++) {
//             if (!visited[arr[i]]) {
//                 stack.push(arr[i])
//                 visited[i] = true;
//                 dfs(arr, visited, stack)
//                 visited[i] = false;
//                 stack.pop();
//             }
//         }
//
//     }
//
//     dfs(arr, visited, stack)
//     return res;
// }

//
//
// console.log(permute([1, 2, 3]));

// function permute(arr) {
//     let res = [];
//     let stack = [];
//     let visited = [false, false, false];
//
//     function dfs(arr, visited, stack) {
//         if (stack.length === arr.length) {
//             res.push([...stack]);
//             return;
//         }
//
//         for (let i = 0; i < arr.length; i++) {
//             if (i > 0 && arr[i] === arr[i - 1] && !visited[i - 1]) {
//                 continue
//             }
//             if (!visited[i]) {
//                 stack.push(arr[i]);
//                 visited[i] = true;
//                 dfs(arr, visited, stack);
//                 visited[i] = false;
//                 stack.pop();
//             }
//         }
//     }
//
//     dfs(arr, visited, stack);
//     return res;
// }
//
// console.log(permute([1, 2, 3]));


// function combine2(arr, k) {
//     let res = []
//
//     function dfs(curr, start) {
//         if (curr.length === k) {
//             res.push([...curr])
//             return
//         }
//
//         for (let i = start; i < arr.length; i++) {
//             curr.push(arr[i])
//             dfs(curr, i + 1)
//             curr.pop()
//         }
//     }
//
//     dfs([], 0)
//
//     return res;
// }
//
// console.log(combine2([1, 2, 3], 2))


function permute(arr) {
    let res = []
    let stack = []
    let visited = new Array(arr.length).fill(false);

    function dfs(arr, visited, stack) {

        if (stack.length === arr.length) {
            res.push([...stack])
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            if (!visited[i]) {
                stack.push(arr[i])
                visited[i] = true
                dfs(arr, visited, stack)
                visited[i] = false
                stack.pop()
            }
        }
    }


    dfs(arr, visited, stack);
    return res
}


console.log(permute([1, 2, 3]));


class MaxHeap {
    constructor(arr = []) {
        this.heap = arr;
    }


    heapify() {
        for (let i = this.lastLeafNode(); i >= 0; i--) {
            this.siftDown(i);
        }
    }

    up(element) {
        let child = this.heap.length;
        while (child > 0) {
            let parent = (child - 1) >>> 1;
            if (element > this.heap[parent]) {
                this.heap[child] = this.heap[parent];
            } else {
                break;
            }
            child = parent;
        }
        this.heap[child] = element;
    }


    siftDown(parent) {
        let max = parent;
        let left = parent * 2 + 1;
        let right = left + 1;
        if (left < this.heap.length && this.heap[left] > this.heap[max]) {
            max = left;
        }

        if (right < this.heap.length && this.heap[right] > this.heap[max]) {
            max = right;
        }

        if (max !== parent) {
            let temp = this.heap[max];
            this.heap[max] = this.heap[parent];
            this.heap[parent] = temp;
            this.down(max);
        }
    }


    siftUp() {

    }


    lastLeafNode() {
        return (this.heap.length - 1) >>> 1
    }
}



















月度版本需求开发： 独立负责低流量报表特性需求的任务，实现达成由系统管理员，租户管理，分析师各个权重角色低流量报表增删改查，低流量报表通知，低流量报表数据概览等业务功能实现
独立负责YBI报表协同编辑，批量授权，批量分享租户进行批量协同编辑报表前端功能的实现，






责任田的看护 对已经开发的版本特性，例如报表低流量治理、报表协同编辑等、模块功能模块跟进bug修复，及时维护。
2.    新版本技能需要的


组织的贡献 1.   对项目组产品的更新迭代贡献代码输出、

部门的任务 1.   输出 2.通过初级数据分析师考试  3. 通过《UniIOC产品架构应知应会考试》


文化技能的学习 1. 参加火焰班技能特训，熟悉了解华为开发者文化氛围、了解华为IT部门历史各个阶段的发展变化，由大树成长为一片森林的壮大发展历程，通过对华为公司相关知识理论体系的学习，作为华为开发掌握其基本开发职业要求与素养，对自我要求高标准，高质量输出产品迭代所需的工程编码



1. 培养计划是否走完？ 到哪个阶段
2. OD要求的基本学习是否走完？
3. 可信考试通过情况

工作绩效（工作输出） 重点说明如下三项：
1、我的直接贡献是什么；2、我帮助谁取的了什么成果；3、我复用了什么能力或组件？
2、有成就感的工作，完成不理想的工作及原因进行重点说明。
3、完成任务过程中的感受---可选
4、工作中遇到的困难和自己采取得对策，解决方法应该有体现（包括工作安排上的问题，沟通中的问题等）----可选


 绩效贡献举证（主要举证在华为绩效贡献，社招员工可适量举证在原公司成果）：
一、 工作职责概述（过去两年内的工作范围，工作内容等的概述）
    二、 工作中的角色（在自身的责任范围和工作中发挥的作用）
        三、 主要工作成果举例（2-3项）-背景-本人在其中的角色（发挥的作用）-工作成果（实现的价值、获得的认可）



证明人：XXX
1、对应的工作成果交付件及存档地址  


建议：
重点在6个月内，为达成相关目标，过程中自己的感悟，自己做得好需继续保持的方面，并反思自己的不足之处






周庄：
1.个人独立负责自助服务报表模块sql拦截功能的开发，支撑了自助服务因sql性能问题而导致的服务器宕机问题，完成了二层部门技术难题《his难题-基于动态sql拦截重组的报表性能加速》课题的研究与开发任务并上线验收 2. 参与报表模块基于YBI抽数加速特性需求开发，解决YBI关键报表性能问题 3.参与ICSL送检任务，对自助服务的报表模块后端返回给前端的初参进行修改和封装 4.完成“ROMA数据源接入IOC自助服务”需求。

1.输出IOC自助服务报表、数据关联模块用户操作流程图和接口调用图 2.总结两个模块所有异常的种类(108种)，规整两个模块抛出异常的类型（11种） 3.编写两个模块单元测试8000多行，模块覆盖率10% 4.分析定位自助服务API调用缓慢问题7个。5.承担bug单修改7项 


例会HIS社区分享洞察报告1次、3ms社区分享学习笔记1次、产品onebox上传《sql动态拦截产品设计文档》一份、产品onebox上传《异常sql特征分析总结》一份、产品onebox上传《BP神经网络算法解析》一份、代表一层部门参与华为篮球比赛、定期组织篮球活动4次、积极参与团队组织的团建活动并担任志愿者5次、带动团队成员积极参加羽毛球和乒乓球等各类运动6次


1.输出《 Microsoft Fabric洞察报告 》2.独立实施变更上线任务7次 3.通过初级数据分析师考试 4. 通过《UniIOC产品架构应知应会考试》

华为公司相关知识理论体系的学习（通过《2023年BCG基础知识考试》、软件开发规范网络安全与隐私保护基础知识及意识提升综合考试》等10余门考试；在NEO培训、硬装培训中担任组长，并获得优秀团队奖。


	1.独立承担《his难题-基于动态sql拦截重组的报表性能加速》课题的研究与开发任务，完成了从需求到方案的制定、算法的设计与选定、项目的落地及上线。
	输出：《动态sql拦截重组产品设计文档》一份，《异常sql特征分析总结》一份，《BP神经网络原理分析》一份，利用代理模式修改PG源码，抽取设计方案，可适配任意BI工具。创新引入AI神经网络算法，产出算法3种（约3000行），上线总业务代码1.1W行，
	2. 参与基于YBI抽数加速特性需求开发，解决YBI关键报表性能问题，报表打开性能对比直连数据库场景；实现对用户抽数权限治理及管控，分析师MPP抽数能力服务化。
	输出：上线代码1000行。
	3.参与ICSL送检任务，对自助服务的report模块后端返回给前端的初参进行修改和封装，输出代码500余行。
	4.参与“ROMA数据源接入IOC自助服务”需求开发 ，完成对IOC数据源的切换需求，输出代码200余行

输出：《动态sql拦截重组产品设计文档》一份，《异常sql特征分析总结》一份，《BP神经网络原理分析》一份，利用代理模式修改PG源码，抽取设计方案，可适配任意BI工具。创新引入AI神经网络算法，产出算法3种（约3000行），上线总业务代码1.1W行，


2. 参与基于YBI抽数加速特性需求开发，解决YBI关键报表性能问题，报表打开性能对比直连数据库场景；实现对用户抽数权限治理及管控，分析师MPP抽数能力服务化。

	输出：上线代码1000行。
	3.参与ICSL送检任务，对自助服务的report模块后端返回给前端的初参进行修改和封装，输出代码500余行。

4.参与“ROMA数据源接入IOC自助服务”需求开发 ，完成对IOC数据源的切换需求，输出代码200余行。


问题：
 	      YBI关键报表性能问题，报表打开速度缓慢、尤其是在关键重大重要场合的核心报表打开速度过慢，影响业务

难点：
        	      如何在有限的资源内实现对YBI特定报表的加速功能，并且对抽数能力进行治理和管控，将平台抽数资源更好投入到关键的报表加速场景中





解决方法：引入MPP数据库
       1.基于数据集而非分析师来进行数据抽取，进行抽数权限精细化运营和管理。
      2.将分析师当前抽数权限进行回收和治理，进行基于数据抽取任务的统一管理，避免抽数任务及资源的浪费。

解决YBI关键报表性能问题：报表打开性能对比直连数据库场景，top50的报表，关键核心报表实现5s内打开

用户抽数权限治理及管控：分析师MPP抽数能力服务化，对抽数能力进行治理和管控，平台抽数资源能更好投入到关键的报表加速场景中

自己在学习、工作中的收获：
	1.不怕失败、敢于尝试、大胆做
	2.团队合作是重中之重，要多学多问多听多看，多向身边优秀的同事请教
                     3.提高流程规范意识，合理利用公司资源
	4.工作和生活balance，可持续发展
分析自己工作中的优点，缺点：
	1.项目中不敢提出自己的疑问，敢于提出自己的疑问，多思考问题
	2.做项目时没有进行一个全局的思考，不能只限于代码层面的编写

1、半年之内能独立看护责任田，独立负责IOC自助服务report模块和relation模块
2、能独立负责从需求到上线的全部流程
1、掌握测试开发以及重构手法

2、掌握系统整体设计、开发能力

3、提升需求分析和方案分析的能力，熟悉业务知识流程

1、成为一名全栈工程师

2、探索新领域、新技术，提升技术竞争力





周汉波

一、 工作职责概述（过去两年内的工作范围，工作内容等的概述）
        在过去的两年内,一直在自助分析服务子产品中担任前端开发,看护自助分析子产品前端模板,完成前端需求开发
二、 工作中的角色（在自身的责任范围和工作中发挥的作用）
      复用AUI组件能力,搭建项目的前端工程架构,建立前端流水线构建工程包并部署, 经常帮助项目组的其他前端小伙伴解决疑难杂症,为新入职的前端提供指导,能更快的融入到项目开发中.
三、 主要工作成果举例（2-3项）
     1.从0到1实现合一版前端架构,复用AUI+vue3.0新框架实现前后端分离,独立部署,提高前端开发效率.
     2.复用antv x6组件实现数据关联模块

 



优点:
1.按时完成需求,bug单日清日结
2.需求有疑问的地方主动拉BA与SE沟通

不足之处:
1.对于自己开发的很多需求,只了解前端自己负责的模块,对后端底层的实现不了解
2.不善于终结输出文档



1.争取年底通过科目四,拿到可信专业级证书

2.多学习些后端知识,要了解需求整体的实现过程

3.多总结输出相关技术文档 



















































































































































































































