;(function(){	
	var 
	S = function(el){							
		return {
			element: el,
			hasClass: function(cls){
				return !!this.element.classList ? (!!el.classList.contains(cls) ? true : false) : false;
			},				
			addClass: function(cls){				
				return this.element.classList.add(cls);
			},
			removeClass: function(cls){
				return this.element.classList.remove(cls);
			},
			hasAttr: function(attr){				
				return !!this.element.attributes.getNamedItem(attr)
			},
			toggle: function(){
				if(!el) return;	
				var style = el.style, 
				    content = style.cssText, patt;							
				
				if(!style.cssText.length){
					style.cssText = 'display: none';					
					return this;
				}		
				var cached_content = content;
				content = content.replace(/(\s+)/g, ' ').split(/\s*;\s*/);
				
				patt = (!!~content.indexOf('display: none')) 
						? ['display: none', 'display: block']			
						: ['display: block', 'display: none'];									
				
				style.cssText = cached_content.replace(patt[0], patt[1]);											
				return this;				
			},
			toggleClass: function(){
				
			}			
		}
	}, 
	
	Debug = function(el){				
		this.elem = el.cloneNode(true);			
		this.notype = S(el).hasAttr('notype');
		this.text = el.innerText || el.textContent || '';
		this.patt = [[/{/g, '<span class="de-parent"><span class="de-inner">{<ul class="de-child">'],
				     [/}/g, '</ul>}</span></span>'],
				     [/=>((\s)+)/gm, ' => '],
				     [/NULL/gm, '<b class="de-null">NULL</b>'],
				     [/(\[.*)/gm, '<li class="de-elem">$1</li>\n'],
				     [/(array|int|double|float|string|bool|object)(\((.*)\))/g, (this.notype ? '' : '<i>$1</i>') + '(<b class="de-total $1">$3</b>)'],
					 ];		
					 
		this.log()
		    .filter(this.patt, this.patt.length, 0)
		    .set();					
		this.addEvent(this.elem, 'click', this._delegate);		
		
	};				
	
	Debug.prototype._delegate = function(ev){
		var target = ev.target;			
		
		(S(target).hasClass('de-elem') 
		 || S(target.parentNode).hasClass('de-elem')
		 || S(target.parentNode).hasClass('de-box')
		 ) 
		 
		&& (function(){		
		
		 var innerNode = this.getElementsByClassName('de-inner')[0],
		     textNode = innerNode.childNodes[2],
			deChild = S(this.getElementsByClassName('de-child')[0]);
		 
			(S(innerNode).hasClass('de-hover')) 
			  ? (
				 S(innerNode).removeClass('de-hover'),
				 textNode.nodeValue = '}')
			  : (
			     S(innerNode).addClass('de-hover'),
				textNode.nodeValue = '..}') ;			  					 
				
			deChild.toggle();				
			
		}.call(S(target).hasClass('de-elem') ? target : target.parentNode));	
		
	};
	
	Debug.prototype.addEvent = function(element, evnt, funct){	
	  if (element.attachEvent)
	   return element.attachEvent('on'+evnt, funct);
	  else
	   return element.addEventListener(evnt, funct, false);
	}
	
	Debug.prototype.set = function(){			
		this.elem.innerHTML = this.text;	
		return this;
	};
	
	Debug.prototype.log = function(){
	var text = this.text
				 .replace(/=>((\s)+)/gm, ' => ')
				 // .split(/(\[.*)/gm)
				 // .forEach(function(el){
					// console.log(el);
				 // });
				 
		console.log(text);
		return this;
	};

	Debug.prototype.filter = function(patt, len, index){
		
		if(len < 0 || index >= len)
			return this;		
			
		this.text = this.text.replace(patt[index][0], patt[index][1]);		
		index++;
		return this.filter(patt, len, index);
		
	};
	
	Debug.prototype.display = function(){
		
		var style = document.createElement('style');
			css = "";
			
		css += ".de-box{display: block !important; position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;margin: 0px;overflow-x: auto;overflow-y: auto; background: #FFF;}";
		css += ".de-box ul{list-style: none;}";
		css += ".de-box i{color: #4796B8;}";		
		css += ".de-box * {text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.11);}";		
		css += ".de-total{color: #A9A9A9; font-weight: normal; font-size: 11px;}";
		css += ".de-total:not(.array):not(.string){color: #37C310; font-size: 13px;}";
		css += ".de-child{border-left: 1px solid rgb(234, 234, 234); padding-left: 0px; line-height: 5px;  margin:0;}";
		css += ".de-elem{line-height: 15px; text-indent: 10px; color: #777;}";
		css += ".de-inner{display: inline-table; color: red;}";		
		css += ".de-null{color: #7100FF;}";		
		css += ".de-hover.de-inner{position: relative;}";
		css += ".de-hover.de-inner:hover > .de-child{position: absolute;top: 15px;left: 10px;background: #FFF; padding: 3px;box-shadow: 0px 0px 12px rgba(0,0,0,.1);border: 1px solid rgb(223, 223, 223);display: block !important; z-index:1;}";
		
		this.elem.classList.add('de-box');
		
		style.appendChild(document.createTextNode(css));
		
		document.body.removeChild(de);
		document.head.appendChild(style);		
		document.body.appendChild(this.elem);		
		
	};
	
	new Debug(de).display();
	
}())