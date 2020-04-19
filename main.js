/*jslint for: true, this: true*/
var document = document;

/*
    === TABLE OF CONTENTS ===

    CKNKK1. Database
    CKNKK2. Config
    CKNKK3. Player
    CKNKK4. Global Variables
    CKNKK5. Init
    CKNKK6. Init Functions
    CKNKK7. Cooking
    CKNKK8. Mixing
    CKNKK9. Inventory
    CKNKK10. Shop
    CKNKK11. Recipe
    CKNKK12. Magazine
    CKNKK13. Win Condition
    CKNKK14. Functions
*/

// CKNKK1. Database
var database = {
    items: [
        {
            "name" : "flour",
            "price" : 3
        },
        {
            "name" : "unsalted butter",
            "price" : 4
        },
        {
            "name" : "yellowish sugar",
            "price" : 5
        },
        {
            "name" : "chicken egg",
            "price" : 5
        },
        {
            "name" : "sea salt",
            "price" : 7
        },
        {
            "name" : "black chocochips",
            "price" : 10
        },
        {
            "name" : "black chocolate",
            "price" : 10
        },
        {
            "name" : "caramel candy",
            "price" : 12
        }
    ],
    recipes: [
        {
            "name" : "butter cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "unsalted butter",
            "ing_4" : "yellowish sugar",
            "ing_arr" : [
                "flour",
                "unsalted butter",
                "chicken egg",
                "yellowish sugar"
            ],
            "price" : 20,
            "status" : true
        },
        {
            "name" : "chocochips cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "unsalted butter",
            "ing_4" : "black chocochips",
            "price" : 35,
            "status" : false
        },
        {
            "name" : "chocolate cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "unsalted butter",
            "ing_4" : "black chocolate",
            "price" : 35,
            "status" : false
        },
        {
            "name" : "salt cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "unsalted butter",
            "ing_4" : "sea salt",
            "price" : 17,
            "status" : false
        },
        {
            "name" : "caramel cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "unsalted butter",
            "ing_4" : "caramel candy",
            "price" : 40,
            "status" : false
        },
        {
            "name" : "chocochips caramel cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "black chocochips",
            "ing_4" : "caramel candy",
            "price" : 50,
            "status" : false
        },
        {
            "name" : "chocolate caramel cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "black chocolate",
            "ing_4" : "caramel candy",
            "price" : 50,
            "status" : false
        },
        {
            "name" : "black cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "black chocochips",
            "ing_4" : "black chocolate",
            "price" : 50,
            "status" : false
        },
        {
            "name" : "salted chocolate cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "sea salt",
            "ing_4" : "black chocolate",
            "price" : 47,
            "status" : false
        },
        {
            "name" : "salted caramel cookies",
            "ing_1" : "flour",
            "ing_2" : "chicken egg",
            "ing_3" : "sea salt",
            "ing_4" : "caramel candy",
            "price" : 47,
            "status" : false
        }
    ],
    tips: [
        "every cookies always made from flour,"
        +" egg, and your creativity...",
        "salt and sugar will never be together this time...",
        "black combined with black,"
        +" you know, will be black. we love black.",
        "let's try to adding salt to this.."
        +" and this.. and more salt with this.",
        "2 same ingredients will fail. unique item is the key.",
        "not enough money, eh? try to sell more discovered cookies."
    ]
};

// CKNKK2. Config
var config = {
    starterMoney: 50,
    starterItems: [
        // [index, qty]
        // *look index on database.items
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1]
    ],
    arrows: [
        {
            "name" : "up",
            "htmlCode" : "w",
            "keyCode" : 119 //w
        },
        {
            "name" : "down",
            "htmlCode" : "s",
            "keyCode" : 115 //s
        },
        {
            "name" : "left",
            "htmlCode" : "a",
            "keyCode" : 97 //a
        },
        {
            "name" : "right",
            "htmlCode" : "d",
            "keyCode" : 100 //d
        }
    ],
    keyboardNavigator: false
};

// CKNKK3. Player
function Player() {
    this.money = config.starterMoney;
    this.inventory = [];

    return this;
}

Player.prototype.renderMoney = function(){
    if(document.getElementById("money")){
        document.getElementById("money").innerHTML = this.money;
    }
};

Player.prototype.addMoney = function(amount){
    this.money += amount;
    this.renderMoney();
};

// CKNKK4. Global Variables
var player = new Player();
var collected_recipes = 1;
var gameNavigator = new Navigator();

// CKNKK5. Init
$(document).ready(function(){
    // Player
    addStarterItems();

    // Shop
    initializeShop();
    shopUpdate();
    sellThis();

    // Recipes
    generateRecipes();

    // User Interfaces
    player.renderMoney();
    console.log(gameNavigator);
    gameNavigator.activate();
    activateInputReseter();
    activateInputListener();
    activateBackButton();
});

// CKNKK6. Init Functions
// Input reseter
function activateInputReseter(){
    // Get all input element
    var all_input_value = $("input").val();

    // Reset input value if clicked
    if(all_input_value==0){
        $("input").click(function(){this.value = "";});
    }
}

// Input enter key listener
function activateInputListener(){
    $(".buy input").on("keypress", function(e){
        if(e.keyCode==13){
            e.target.parentNode.parentNode.lastChild.firstChild.click();
        }
    });
}

// Back button
// *mungkin ini bisa di deprecate(?)
function activateBackButton(){
    // *yang di html masih dicomment
    $(".back_to_main_menu").click(function(){
        $(".page").hide("fast");
        setTimeout(function(){
            $("#main_menu").toggle();
        }, 100);
    });
}

function Navigator(){
    this.activate = function(){
        $("[data-target]").click(function(e){
            var target = e.target.dataset.target;
            if(target){
                if (target=="cook") {
                    ingInit();
                }else if(target=="inv") {
                    inventoryUpdate();
                }else if(target=="shop") {
                    shopUpdate();
                }else if(target=="recipe") {
                    recipesUpdate();
                }else if(target=="magz"){
                    tipsUpdate();
                }

                switchPage("#"+target+"_page");
            }
        });

        if(config.keyboardNavigator){
            $(window).keypress(function(e){
                var key = e.keyCode;
                var target;

                // 1
                if(key == 49){
                    target = "cook";
                }

                // 2
                else if(key == 50){
                    target = "shop";
                }

                // 3
                else if(key == 51){
                    target = "inv";
                }

                // 4
                else if(key == 52){
                    target = "magz";
                }

                // 5
                else if(key == 53){
                    target = "recipe";
                }

                else{
                    console.log("no target");
                }

                if(target){
                    switchPage("#"+target+"_page");
                }
            });
        }

        var pageReady = true;

        function switchPage(page){
            console.log("switch page,", pageReady);
            if(pageReady){
                pageReady = false;
                $(".page").hide("fast");
                $(page).toggle("fast");
                setTimeout(function(){
                    pageReady = true;
                    console.log("ready again");
                }, 500);
            }
        }
    };

    return this;
}

// Add player starter items
function addStarterItems(){

    // change variable name if you confused
    var si = config.starterItems;
    var di = database.items;

    // Loop through starter items on config
    si.forEach(function(item, idx) {
        // Add item to player's inventory
        addItem({
            "name": di[item[0]].name,
            "qty": item[1]
        });
    });
}

// CKNKK7. Cooking
/*==============*/
/*   COOKING    */
/*==============*/
var ing1 = $("#ing1");
var ing2 = $("#ing2");
var ing3 = $("#ing3");
var ing4 = $("#ing4");

function ingReset(){
    $("#ing1").html("");
    $("#ing2").html("");
    $("#ing3").html("");
    $("#ing4").html("");
}

function ingInit(){
    var inventory = player.inventory;

    ingReset();
    if(inventory.length!=0){
        inventory.forEach(function(item, i){
            if(item.qty!=0 && !item.name.match("cookie")){
                ing1.append("<option>"+item.name+"</option>");
                ing2.append("<option>"+item.name+"</option>");
                ing3.append("<option>"+item.name+"</option>");
                ing4.append("<option>"+item.name+"</option>");
            }
        });
    }else{
        ingReset();
    }
}

$("#random_ing").click(function(){
    var inventory = player.inventory;
    var random = Math.floor(Math.random()*(inventory.length));

    console.log(inventory);
    if(inventory.length!=0){
        for(i = 0; i < 4; i += 1){

            if(inventory[random].qty!=0){
                $("#ing"+(i+1)).html(
                    "<option>"
                    +inventory[random].name
                    +"</option>"
                );
            }
        }
    }
});

// CKNKK8. Mixing
/*==============*/
/*    MIXING    */
/*==============*/
var start_mix = false;

$("#mix_page_trigger").click(function(){
    var inventory = player.inventory;
    var val_arr;

    // Check input field
    if(
        ing1.val()!="" && ing1.val()!=null &&
        ing2.val()!="" && ing2.val()!=null &&
        ing3.val()!="" && ing3.val()!=null &&
        ing4.val()!="" && ing4.val()!=null
        ){

        // Inventory sorting
        inventory.forEach(function(item, i){

            var val1 = ing1.val();
            var val2 = ing2.val();
            var val3 = ing3.val();
            var val4 = ing4.val();
            val_arr = [val1, val2, val3, val4];

            // Inputed items checking
            /*ignore jslint start*/
            var j;
            var inputed;
            for (j = val_arr.length - 1; j >= 0; j--) {
            /*ignore jslint end*/
                inputed = val_arr[j];

                // Inputed item is on inventory. Nice!
                if(inputed==item.name){
                    console.log(inputed+" ada " + item.qty);
                    if(item.qty>0){
                        console.log(inputed+" kita kurangin 1");
                        item.qty-=1;
                        console.log("sekarang "+ item.name+" ada "+item.qty);
                        start_mix = true;
                    }else{

                        // Fungsi di bawah ini akan dieksekusi jika:
                        // Kamu punya 1 item,
                        // tapi masukin ke inputnya 2. contoh:
                        // Ada 1 egg di invetory, tapi nginputnya gini:
                        // !EGG | !EGG | flour | butter
                        // nanti eggnya ilang.
                        // *BUGS: coba beli 2 egg,
                        // terus set inputnya: butter|egg|egg|egg;
                        // *todoe: Enhance item input system.
                        alertCustom(
                            "red",
                            "Whoops! you made a mistake when adding "
                            +item.name+". <br>You lost some ingredients. :(",
                            5000
                        );
                        start_mix = false;
                        if(item.name=="flour"){
                            cashback();
                        }
                        break;
                    }

                }else{
                    console.log(inputed+" bukan " + item.name);
                }
            }

            function cashback() {
                setTimeout(function(){
                    alertCustom(
                        "green",
                        "It's okay.<br> Inkky Supply Co. "+
                        " bought your failed cookies"+
                        " for 1 gold. :)",
                        5000
                    );
                    player.addMoney(1);
                }, 5000);
            }
        });


        if(start_mix==true){
            //change page
            alertCustom("noalpha", "<i>loading...<i>", 1500);
            $(".page").hide("fast");
            setTimeout(function(){
                $("#mix_page").toggle("fast");
                $("#main_menu").hide("fast");
            }, 1500);

            mixingInit(val_arr);

            ingReset();
            ingInit();
        }else{
            console.log("start mix false");
        }

    }else{
        alertCustom("red", "i think we missed something...", 3000);
    }
});

function mixingInit(val_arr){
    var random;
    for(i=0;i<5;i += 1){
        random = Math.floor(Math.random()*(3 + 1));
        // console.log(random)
        $("#mix_container").append(config.arrows[random].htmlCode);
    }
    var container = $("#mix_container");
    var text = container[0].innerText;
    // console.log("text: "+text)

    var text_arr = [];

    var i;
    var splitted;
    for (i = 0; i < text.length; i += 1) {
        splitted = text.substring(i,i+1);
        // console.log(i, splitted)
        text_arr.push(splitted);
    }

    // console.log(text_arr);
    $("#mix_container").html("");
    $("#mix_container").append(text_arr);

    startMixing(text_arr, val_arr);
}

function startMixing(text_arr, val_arr){
    $(document).keypress(function(e){
        // console.log("status: " + start_mix)
        // console.log("pressed: " + e.keyCode)
        // console.log("panjang soal: "+text_arr.length)

        if(text_arr.length==0 || start_mix==false){
            console.log("bukan area mixing");
        }else{
            if (text_arr.length==1 && start_mix==true) {
                //DONE
                text_arr = [];
                $("#mix_container").html("");

                getCookie(val_arr);
            }else{
                // console.log("yang harus dipencet: "+text_arr[0]);
                // console.log("yang kamu pencet: "+e.keyCode);
                // console.log("mulai loop");
                if(e.key!=text_arr[0]){
                    player.addMoney(-1);
                    $("#money").attr(
                        "style",
                        "color:red; font-weight:900"
                    );
                    $(".hint").attr(
                        "style",
                        "color:red; font-weight:900"
                    );
                    setTimeout(function(){
                        $(".hint").attr(
                            "style",
                            "color:#232526; font-weight:400"
                        );
                        $("#money").attr(
                            "style",
                            "color:gold; font-weight:400"
                        );
                    }, 500);
                }else{
                    //delete soalnya satu satu
                    var i;
                    for (i = config.arrows.length - 1; i >= 0; i--) {
                        if(e.keyCode == config.arrows[i].keyCode){
                            if(e.key == text_arr[0]){
                                text_arr.splice(0,1);
                            }
                            break;
                        }
                    }
                }
                $("#mix_container").html("");
                $("#mix_container").append(text_arr);
            }
        }
    });
}

function getCookie(val_arr){
    var cookie;
    console.clear();
    console.log("bahan-bahanmu: "+val_arr);

    var i;
    var a;
    var b;
    var c;
    var d;
    for (i = database.recipes.length - 1; i >= 0; i--) {

        a = searchStringInArray(database.recipes[i].ing_1,val_arr);
        b = searchStringInArray(database.recipes[i].ing_2,val_arr);
        c = searchStringInArray(database.recipes[i].ing_3,val_arr);
        d = searchStringInArray(database.recipes[i].ing_4,val_arr);
        cookie = false;
        if( a>-1 && b>-1 && c>-1 && d>-1 ){
            cookie = database.recipes[i].name;
            break;
        }
        console.log("the loop is stopped an you got nothing");
    }

    start_mix = false;
    $(".page").hide("fast");
    setTimeout(function(){
        $("#main_menu").toggle("fast");

        if(cookie){
            var j;
            var newRecipe = false;
            for (j = database.recipes.length - 1; j >= 0; j--) {
                if(
                    cookie==database.recipes[j].name &&
                    database.recipes[j].status==false
                    ){
                    newRecipe = true;
                    database.recipes[j].status = true;
                }
            }

            if(newRecipe){
                collected_recipes += 1;
                alertCustom(
                    "green",
                    "you got a <b>"+cookie+
                    ". New recipe added!</b>.",
                    5000
                );
                recipesUpdate();
            }else{
                alertCustom(
                    "green",
                    "you got a <b>"+cookie+
                    "</b>.",
                    3000
                );
            }

            addItem({
                "name" : cookie,
                "qty" : 1
            });
        }else{
            alertCustom("red", "you got ...<b>nothing</b>.", 3000);
        }
    }, 100);
}

// CKNKK9. Inventory
/*==============*/
/*   INVENTORY  */
/*==============*/
function addItem(item){
    // console.clear();
    if(player.inventory.length==0){
        console.log("add item: "+item.name);
        player.inventory.push(item);
        inventoryUpdate();
    }else{
        // console.warn("mulai sorting yang ada ditas");
        var i;
        var found = false;
        for (i = player.inventory.length - 1; i >= 0; i--) {
            // console.log("sortingan ke: "+i)
            if(item.name==player.inventory[i].name){
                console.log("edit item: "+item.name+" qty");
                found = player.inventory[i];
            }else if(i==0 && item.name!=player.inventory[i].name){
                console.log("push new item:" + item.name);
            }else{
                console.log("yang dibeli:"+item.name,
                "yang kena sorting:"+ player.inventory[i].name);
                // console.log("lanjut sorting")
            }
        }

        if(found){
            found.qty+=item.qty;
            inventoryUpdate();
        }else{
            player.inventory.push(item);
            inventoryUpdate();
        }
    }
}

function inventoryUpdate(){
    $("#inventory").html("");

    var empty = true;

    // reinit items to inv
    var i;
    var item;
    for (i = player.inventory.length - 1; i >= 0; i--) {
        item = player.inventory[i];
        if(item.qty!=0){
            empty = false;
            $("#inventory").append("<li>"+item.qty+" "+item.name+"</li>");
        }
    }

    if (empty) {
        $("#inventory").append("<i>empty.</i>");
    }

    console.log("inventory updated:");
    console.log(player.inventory);
}

// CKNKK10. Shop
/*==============*/
/*     SHOP     */
/*==============*/
function initializeShop(){
    var b = "onclick='buyThis(this.parentNode.parentNode)'";
    var i;
    var item;
    for (i = 0; i <= database.items.length - 1; i += 1) {
        item = "<tr class='shop-item'>"+
        "<td>"+database.items[i].name+"</td>"+
        "<td>"+database.items[i].price+"</td>"+
        "<td><input type='number'></td><td><button " + b +
        ">buy</button></td></tr>";

        // Conditional item placement (left or right column)
        if(i<4){
            $("#shop_inventory").append(item);
        }else{
            $("#shop_inventory2").append(item);
        }
    }
}

function shopUpdate(){
    $("#sellthis").html("");
    var i;
    var items;
    for (i = player.inventory.length - 1; i >= 0; i--) {
        items = "<option value='"+player.inventory[i].name+"'>"
        +player.inventory[i].name+"</option>";

        if(player.inventory[i].qty!=0){
            $("#sellthis").append(items);
        }
    }
}

function buyThis(item){
    var item_name = item.firstChild.innerText;
    var item_price = item.getElementsByTagName("td")[1].innerText;
    var item_qty = item.getElementsByTagName("td")[2].firstChild.value;

    var firstnum = item_qty.substring(0,1);
    var reg = /^0/gi;

    //wrong input
    if(item_qty==0 || item_qty==""){
        alertCustom("red", "you bought nothing.", 3000);
    }
    //not enough money
    else if(player.money<=0 || (item_qty*item_price>player.money)){
        alertCustom("red", "not enough money.", 3000);
    }
    // else if(item_qty.match(reg)){
    // alertCustom("red", "please, do not start with 0.", 3000);
    // }
    else{

        //success buy
        var msg = "You bought: "+item_qty+" "
        +item_name+"(s). Total price: "+item_qty*item_price;

        // console.log(msg)
        alertCustom("green", msg, 3000);
        item.getElementsByTagName("td")[2]
        .firstChild.style.border = "2px solid green";



        //put bought items into inventory
        addItem({
            "name": item_name,
            "qty": parseInt(item_qty)
        });

        player.addMoney(-(item_price*item_qty));
        shopUpdate();

        setTimeout(function(){
            item.getElementsByTagName("td")[2]
            .firstChild.value = "0";
            item.getElementsByTagName("td")[2]
            .firstChild.style.border = "1.1px solid grey";
        }, 1000);
    }
}

function sellThis(){
    var item_to_sell;

    function getQty(e){
        var selected_item = e.target.value;
        item_to_sell = e.target.value;
        var i;
        for (i = player.inventory.length - 1; i >= 0; i--) {
            if(selected_item==player.inventory[i].name){
                $("#sell_qty").val(player.inventory[i].qty);
            }
        }
    }

    $("#sellthis").click(function(e){
        getQty(e);
    });
    $("#sellthis").change(function(e){
        getQty(e);
    });

    $("#sell").click(function(){
        var sell_price;
        item_to_sell = $("#sellthis").val();
        var qty = $("#sell_qty").val();
        var in_inventory_qty;
        var i;

        for (i = database.items.length - 1; i >= 0; i--) {
            if(database.items[i].name==item_to_sell){
                sell_price = database.items[i].price-2;
            }
        }
        console.log(qty);
        //cek jml item yang dijual bukan 0
        if(qty!=0 && qty!=null && qty!=" "){

            console.log("sell this:"+item_to_sell);
            console.log("sell price:"+sell_price);
            console.log("sell qty:"+qty);

            var h;
            var j;
            var the_item_index = -1;
            for (h = player.inventory.length - 1; h >= 0; h--) {
                //cek ada ga di inv
                if(item_to_sell==player.inventory[h].name){
                    the_item_index = h;
                }else{
                    console.log("load...");
                }
            }

            if(the_item_index > -1){
                var the_item = player.inventory[the_item_index];
                in_inventory_qty = the_item.qty;

                //cek jml di inv dulu
                if(qty<=in_inventory_qty){

                    //cek yang dijual cookies bukan
                    for (j = database.recipes.length - 1; j >= 0; j--) {
                        if(item_to_sell==database.recipes[j].name){
                            sell_price = database.recipes[j].price;
                            break;
                        }
                    }

                    alertCustom(
                        "green",
                        "<b>"+ qty+" "
                        +item_to_sell+"</b> sold. You got <b>"
                        +(qty*sell_price)
                        +"</b> gold!",
                        3000
                    );

                    player.addMoney(qty*sell_price);

                    in_inventory_qty-=qty;
                    the_item.qty = in_inventory_qty;

                    inventoryUpdate();
                    shopUpdate();
                    $("#sell_qty").val("");
                }else{
                    alertCustom(
                        "red",
                        "are you sure you have that much?",
                        1500
                    );
                    $("#sell_qty").val(the_item.qty);
                }
            }
        }
        else{
            alertCustom("red", "you sell nothing.", 2000);
        }
    });
}

// CKNKK11. Recipe
/*==============*/
/*   RECIPE     */
/*==============*/
function generateRecipes(){
    var i;
    var item;
    var list;
    for (i = 0; i <= database.recipes.length - 1; i += 1) {
        item = database.recipes[i];
        list = "<div class='recipe'><i class='price'> sell price: <b>"
        +item.price+"</b>g</i><h4>"+item.name+"</h4>"
        +"<ul><li>"+item.ing_1+"</li>"
        +"<li>"+item.ing_2+"</li>"
        +"<li>"+item.ing_3+"</li>"
        +"<li>"+item.ing_4+"</li></ul>"
        +"</div>";

        if(item.status){
            $("#recipes").append(list);
        }
    }
}

function recipesUpdate(){
    $("#recipes").html(" ");
    generateRecipes();
    isWin();
}

// CKNKK12. Magazine
/*=====================*/
/*   MAGAZINE          */
/*=====================*/
function tipsUpdate(){
    var selected_tips = Math.floor(Math.random() * (database.tips.length + 1));

    //tips adding
    $("#tips").html(database.tips[selected_tips]);
}

// CKNKK13. Win Condition
/*=====================*/
/*   WIN CONDITION     */
/*=====================*/
function isWin(){
    if(collected_recipes==10){
        setTimeout(function(){
            $("#recipe_page").hide();
            $("#credits").show("slow");
            $("#main_menu").hide("slow");
            console.log("10 RECIPES COLLECTED! YOU WIN! CONGRATULATIONS!");
        }, 1000);
    }else{
        console.clear();
        console.log("collected_recipes: "+collected_recipes);
    }
}

// CKNKK14. Functions
/*=== FIXED FUNCTIONS ===*/
function alertCustom(color, msg, timeout){
    var wb = "color:white; display:block;";

    document.getElementById("alert").innerHTML = msg;
    $("#alert").click(function(){
        $("#alert").hide();
    });
    if(color=="green"){
        document.getElementById("alert")
        .setAttribute(
            "style",
            "background:linear-gradient(30deg, #00b09b, #96c93d);" + wb
        );
    }
    else if(color=="yellow"){
        document.getElementById("alert")
        .setAttribute(
            "style",
            "background-color:lightyellow; color:brown; display:block;"
        );
    }
    else if(color=="red"){
        document.getElementById("alert")
        .setAttribute(
            "style",
            "background:linear-gradient(30deg, #FF070B, #E5008D);" + wb
        );
    }
    else if(color=="noalpha"){
        document.getElementById("alert")
        .setAttribute(
            "style",
            "background-color:rgba(0,0,0,0); color:#232526; display:block;"
        );
    }
    else{
        alert(msg);
    }

    if(timeout==0){
        $("#alert").show("slow");
    }else{
        setTimeout(function(){
            document.getElementById("alert").style.display = "none";
        }, timeout);
    }
}

/*=== PURE FUNCTIONS ===*/
function searchStringInArray (str, strArray) {
    var j;
    for (j=0; j<strArray.length; j += 1) {
        if (strArray[j].match(str)) { return j; } //indexnya
    }
    return -1;
}
