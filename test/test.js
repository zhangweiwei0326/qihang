(function(){
    var list = null;
    
    module("ArrayList", {
        setup: function(){
            list = new ArrayList();
        },
        teardown: function(){
            list = null;
        }
    });
    
    test("constructor", function(){
        ok(list.isEmpty(), "new ArrayList() is Empty.");
        list = new ArrayList([1, 2, 3, 4]);
        equal(4, list.size(), "new ArrayList([1,2,3,4]), list.size()");
        list = new ArrayList(null);
        equal(0, list.size(), "new ArrayList(null), list.size()");
    });
    
    test("setDatas", function(){
        list.setDatas([8, 6, 3, 7, 9]);
        equal(5, list.size(), "list.setDatas([8,6,3,7,9]); list.size()");
        equal("[8,6,3,7,9]", list.toString(), "list.toString()");
    });
    
    test("getDatas", function(){
        list.setDatas([8, 6, 3, 7, 9]);
        equal(5, list.getDatas().length, "list.setDatas([8,6,3,7,9]); list.getDatas().length");
        equal("8,6,3,7,9", list.getDatas().toString(), "list.getDatas().toString()");
    });
    
    test("size", function(){
        equal(0, list.size(), "only call constructor, list.size()");
        list.add(1);
        list.add(2);
        list.add(3);
        equal(3, list.size(), "call add method three times, list.size()");
    });
    
    test("isEmpty", function(){
        equal(true, list.isEmpty(), "only call constructor, list.isEmpty()");
        list.add(1);
        equal(false, list.isEmpty(), "call add method one times, list.isEmpty()");
    });
    
    test("contains", function(){
        list.add(1);
        list.add(2);
        equal(true, list.contains(1), "list is [1,2], list.contains(1)");
        equal(true, list.contains(2), "list is [1,2], list.contains(2)");
        equal(false, list.contains(3), "list is [1,2], list.contains(3)");
    });
    
    test("indexOf", function(){
        list.add(1);
        list.add(2);
        equal(0, list.indexOf(1), "list is [1,2], list.indexOf(1)");
        equal(1, list.indexOf(2), "list is [1,2], list.indexOf(2)");
        equal(-1, list.indexOf(3), "list is [1,2], list.indexOf(3)");
    });
    
    test("lastIndexOf", function(){
        list.add(1);
        list.add(2);
        equal(0, list.lastIndexOf(1), "list is [1,2], list.lastIndexOf(1)");
        equal(1, list.lastIndexOf(2), "list is [1,2], list.lastIndexOf(2)");
        equal(-1, list.lastIndexOf(3), "list is [1,2], list.lastIndexOf(3)");
    });
    
    test("toArray", function(){
        list.add(1);
        list.add(2);
        equal("1,2", list.toArray().toString(), "list is [1,2], list.toArray() is");
        same(list.getDatas(), list.toArray());
    });
    
    test("outOfBound", function(){
        list.add(1);
        list.add(2);
        same(true, list.outOfBound(-1), "list is [1,2], list.outOfBound(-1) is");
        same(false, list.outOfBound(0), "list is [1,2], list.outOfBound(0) is");
        same(false, list.outOfBound(1), "list is [1,2], list.outOfBound(1) is");
        same(true, list.outOfBound(2), "list is [1,2], list.outOfBound(2) is");
    });
    
    test("get", function(){
        list.add("jack");
        list.add("mary");
        same("jack", list.get(0), "list is [jack, mary], list.get(0) is");
        same("mary", list.get(1), "list is [jack, mary], list.get(1) is");
    });
    
    test("set", function(){
        list.add("jack");
        list.set(1, "mary");
        same("mary", list.get(1), 'list.set(1, "mary"); list.get(1) is');
        list.set(0, "mike");
        same("mike", list.get(0), 'list.set(0, "mike"); list.get(0) is');
    });
    
    test("add", function(){
        list.add(10);
        list.add(20);
        equal(10, list.get(0), "list add after is [10,20], list.get(0) is");
        equal(20, list.get(1), "list add after is [10,20], list.get(1) is");
    });
    
    test("insert", function(){
        list.add(10);
        list.add(20);
        list.insert(0, 30);
        equal(30, list.get(0), "list is [10,20], list.insert(0, 30), list.get(0) is");
        list.insert(2, 6);
        equal(6, list.get(2), "list is [30,10,20], list.insert(2, 6), list.get(2) is");
    });
    
    test("remove", function(){
        list.add(1);
        list.add(2);
        equal(true, list.remove(0), "list is [1, 2], list.remove(0) is ");
        list.clear();
        equal(false, list.remove(0), "list is [], list.remove(0) is ");
    });
    
    test("removeValue", function(){
        list.add("jack");
        list.add("mike");
        equal(true, list.removeValue("jack"), "list is ['jack', 'mike'], list.removeValue('jack') is");
        list.clear();
        equal(false, list.removeValue("jack"), "list is [], list.removeValue('jack') is");
    });
    
    test("clear", function(){
        list.add(10);
        list.add(20);
        ok(!list.isEmpty(), "Before call clear, list is " + list.toString());
        list.clear();
        ok(list.isEmpty(), "After call clear, list is " + list.toString());
    });
    
    test("addAll", function(){
        var tmpList = new ArrayList([10, 20]);
        list.addAll(tmpList);
        same(list.getDatas(), tmpList.getDatas(), "tmpList is [10,20], list.addAll(tmpList), list is ");
    });
    
    test("insertAll", function(){
        var tmpList = new ArrayList([10, 20]);
        list.add(30);
        list.insertAll(0, tmpList);
        same(10, list.get(0), "tmpList is [10,20], list is [30], list.insertAll(0, tmpList), list.get(0) is ");
        same(20, list.get(1), "tmpList is [10,20], list is [30], list.insertAll(0, tmpList), list.get(1) is ");
        same(30, list.get(2), "tmpList is [10,20], list is [30], list.insertAll(0, tmpList), list.get(2) is ");
        same(3, list.size(), "list.size() is ");
    });
    
    test("sort", function(){
        list.setDatas([6, 9, 3, 1, 5]);
        list.sort(true);
        same("[1,3,5,6,9]", list.toString(), "list is [6,9,3,1,5], list.sort(true), list is ");
        list.clear();
        list.setDatas([4, 33, 222, 1111]);
        list.sort();
        same("[1111,222,33,4]", list.toString(), "list is [4,33,222,1111], list.sort(), list is ");
    });
    
    test("toString", function(){
        list.setDatas([6, 9, 3]);
        same("[6,9,3]", list.toString(), "list is [6, 9, 3], list.toString() is ");
    });
    
    test("valueOf", function(){
        list.setDatas([6, 9, 3]);
        same("[6,9,3]", list.valueOf(), "list is [6, 9, 3], list.toString() is ");
    });
})();


(function(){
    var map = null;
    
    module("Map", {
        setup: function(){
            map = new Map();
            map.put("v001", "jack");
            map.put("v002", "mike");
        },
        teardown: function(){
            map = null;
        }
    });
    
    test("constructor", function(){
        map = new Map();
        ok(map.isEmpty(), "only call constructor, map is empty.");
        map = new Map({
            'v001': 'jack',
            'v002': 'mike'
        });
        equal("jack", map.get('v001'), "new Map({'v001' : 'jack', 'v002': 'mike'}), map.get('v001') is");
        equal("mike", map.get('v002'), "new Map({'v001' : 'jack', 'v002': 'mike'}), map.get('v002') is");
    });
    
    test("put size", function(){
        equal(2, map.size(), "call put two times, the key not same, map.size() is");
        map.put("v002", "lucy");
        equal(2, map.size(), "call put three times , the last time, the key is repeat, map.size() is");
    });
    
    test("isEmpty", function(){
        equal(false, map.isEmpty(), "call put two times, map.isEmpty() is");
    });
    
    test("containsKey", function(){
        equal(true, map.containsKey("v001"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.containsKey('v001') is");
        equal(true, map.containsKey("v002"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.containsKey('v002') is");
        equal(false, map.containsKey("v003"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.containsKey('v003') is");
    });
    
    test("containsValue", function(){
        equal(true, map.containsValue("jack"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.containsValue('jack') is");
        equal(true, map.containsValue("mike"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.containsValue('mike') is");
        equal(false, map.containsValue("lucy"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.containsValue('lucy') is");
    });
    
    test("get", function(){
        equal("jack", map.get("v001"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.get('v001') is");
        equal("mike", map.get("v002"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.get('v002') is");
    });
    
    test("remove", function(){
        equal(true, map.remove("v001"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.remove('v001') is");
        equal(false, map.remove("v003"), "map is {'v001' : 'jack', 'v002': 'mike'}, map.remove('v003') is");
    });
    
    test("putAll", function(){
        var map2 = new Map();
        map2.putAll(map);
        equal(map.size(), map2.size(), "map2 is empty, map2.putAll(map), map2.size() is ");
    });
    
    test("clear", function(){
        equal(2, map.size(), "before call clear method, map.size() is ");
        map.clear();
        equal(0, map.size(), "after call clear method, map.size() is ");
    });
    
    test("values", function(){
        equal('jack,mike', map.values().join(), "map is {'v001' : 'jack', 'v002': 'mike'}, map.values() is ");
    });
    
    test("keySet", function(){
        equal('v001,v002', map.keySet().join(), "map is {'v001' : 'jack', 'v002': 'mike'}, map.keySet() is ");
    });
    
    test("entrySet", function(){
        var map2 = new Map(map.entrySet());
        equal('{v001:jack,v002:mike}', map2.toString(), "map is {'v001' : 'jack', 'v002': 'mike'}, map.entrySet() is ");
    });
    
    test("toString", function(){
        equal('{v001:jack,v002:mike}', map.toString(), "map is {'v001' : 'jack', 'v002': 'mike'}, map.toString() is ");
    });
    
    test("valueOf", function(){
        equal('{v001:jack,v002:mike}', map.valueOf(), "map is {'v001' : 'jack', 'v002': 'mike'}, map.valueOf() is ");
    });
})();