(function ($) {
    /**
     * Constructor to create new multi-select
      */
    let Select = function (select) {
        //properties
        this.selectedOptionsArr = [];
        this.selectId = $(select).attr("id");
        this.defaults = {numberDisplayed:2};
        this.selectedText = "Select";
        //hide native select and show bootstrap dropdown to act as multi-select
        $(select).attr("multiple","multiple");
        $(select).after(this.getDropdownTemplate());
        $(select).hide();
    };
    /**
    * build bootstrap dropdown
     */
    Select.prototype.getDropdownTemplate = function () {
        let template = `<div id="${this.selectId}"><div class="dropdown">`;
        template += `<button class="btn btn-primary dropdown-toggle form-control" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                         Select
                      </button>`;
        template += ` <ul class="dropdown-menu" aria-labelledby="dLabel" style="width: 100%;padding: 1em;">`;
        let options = document.getElementById(this.selectId).options;
        for (let i = 0; i < options.length; i++){
            template += `<li class="select-option">
                             <a href="#" id="${options[i].value}_${this.selectId}" data-index = "${i}">
                             <i class="far fa-square"></i> ${options[i].text}
                             </a>
                             </li>`;
        }
        template += `</ul>`;
        template += `</div></div>`;
        return template;
    };
    /**
     * prevents default behavior of bootstrap dropdown
     * binds list items and select options
     */
    Select.prototype.initActions = function () {
        //avoid misuse of this
        let obj = this;
        $(document).on("click",`#${this.selectId} a`,event =>{
            event.preventDefault();
            event.stopPropagation();
            $(obj.selectId).find(".dropdown").addClass("show");
            $(obj.selectId).find(".dropdown-menu").addClass("show");
            let listItem = event.target;
            if ($(".fa-square").is(listItem)){
                listItem = listItem.closest("a");
            }
            let id = listItem.getAttribute("id");
            let index = listItem.getAttribute("data-index");
            let text = listItem.innerText;
            let objIndex = this.selectedOptionsArr.findIndex(sel => sel.id == id);
            let options = document.getElementById(this.selectId).options;
            if (objIndex > -1){
                obj.selectedOptionsArr.splice(objIndex,1);
                listItem.innerHTML = `<i class="far fa-square"></i> ${text}`;
                options[index].removeAttribute("Selected");
            }else {
                obj.selectedOptionsArr.push({id:id,index:index,text:text});
                listItem.innerHTML = `<i class="fas fa-square"></i> ${text}`;
                options[index].setAttribute("Selected",true);
            }
            if (obj.selectedOptionsArr.length > 0){
                obj.selectedText = ""
            }else {
                obj.selectedText = "Select";
            }
            if (obj.selectedOptionsArr.length === options.length){
                obj.selectedText = `All Selected`;
            } else if (obj.selectedOptionsArr.length > obj.defaults.numberDisplayed){
                obj.selectedText = `${obj.selectedOptionsArr.length} Selected`;
            }else {
                obj.selectedOptionsArr.forEach(item => {
                    obj.selectedText = obj.selectedText + " "+item.text+",";
                });
            }
            $(`#${id}`).closest(".dropdown").find(".dropdown-toggle").text(`${this.selectedText}`);
        });
    };
    /**
     * Jquery plugin
     */
    function Mselect(options) {
        let sel = new Select(this);
        sel.initActions();
        let settings = $.extend(sel.defaults,options);
    }
    $.fn.multiselect = Mselect;
}(jQuery));
