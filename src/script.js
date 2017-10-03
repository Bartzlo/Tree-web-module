'use strict';

let json = `
[
  {"discript": "random text", "name": "item1", "sub": []},
  {"discript": "random text", "name": "item2", "sub": [
    {"discript": "random text", "name": "item21", "sub": []},
    {"discript": "random text", "name": "item22", "sub": [
      {"discript": "random text", "name": "item221", "sub": []},
      {"discript": "random text", "name": "item222", "sub": []},
      {"discript": "random text", "name": "item223", "sub": []},
      {"discript": "random text", "name": "item224", "sub": []}
    ]},
    {"discript": "random text", "name": "item23", "sub": []}
  ]},
  {"discript": "random text", "name": "item3", "sub": []},
  {"discript": "random text", "name": "item4", "sub": []}
]`;

//--------------------------------------------------

class Tree {
  constructor(items) {
    this._items = items;
    this._elem;
  }

  getElement() {
    if (!this._elem) this._constructElem()
    return this._elem;
  }

  _constructElem() {
    let elem = document.createElement('div');
    elem.className = 'tree';

    let coreUl = document.createElement('ul');
    coreUl.className = 'tree__core-list';

    this._addItems(coreUl, this._items);

    elem.appendChild(coreUl);
    this._elem = elem;
  }

  _syncObject(ul) {
      let result = [];
      let lis = ul ? ul.children : [];

      for (var i = 0; i < lis.length; i++) {
        result.push({
          name: lis[i].querySelector('input').value,
          sub: this._syncObject(lis[i].querySelector('ul')),
          discript: lis[i].dataset.discript
        });
      }
      return result;
  }

  _addItems(ul, items) {
    items.forEach(item => {
      let li = this._createLi(item);

      ul.appendChild(li);

      if (item.sub.length > 0) {
        let ul = document.createElement('ul');
        ul.className = 'tree__list';
        ul.style.color = this._getRandomColor();
        li.classList.add('tree__item_root');
        li.classList.add('tree__item_open');
        li.appendChild(ul);

        this._addItems(ul, item.sub);
      }
    });
  }

  _createLi(item) {
    let li = document.createElement('li');
    let input = document.createElement('input');
    let remove = document.createElement('span');
    let toggle = document.createElement('span');
    let add = document.createElement('span');


    li.className = 'tree__item';
    li.dataset.discript = item.discript;

    input.value = item.name;
    input.type = 'text';

    remove.className = 'tree__remove tree__control';
    toggle.className = 'tree__toggle tree__control';
    add.className = 'tree__add tree__control';

    li.appendChild(toggle);
    li.appendChild(remove);
    li.appendChild(add);
    li.appendChild(input);

    toggle.addEventListener('click', e => {
      let classList = e.target.parentElement.classList;

      if (classList.contains('tree__item_close')) {
        classList.remove('tree__item_close');
        classList.add('tree__item_open');
      } else {
        classList.add('tree__item_close');
        classList.remove('tree__item_open');
      }
    });

    remove.addEventListener('click', e => {
      let li = e.target.parentElement;
      let ul = li.parentElement;
      li.remove();
      if (ul.childElementCount === 0) {
        ul.parentElement.classList.remove('tree__item_root');
        ul.parentElement.classList.remove('tree__item_open');
        ul.remove();
      }
    });

    add.addEventListener('click', e => {
      let rootLi = e.target.parentElement;
      let newItem = {discript: "", name: "new item", sub: Array(0)};
      let newLi = this._createLi(newItem);
      let ul = rootLi.querySelector('.tree__list');
      console.log(ul);

      if (!ul){
        ul = document.createElement('ul');
        ul.style.color = this._getRandomColor();
        ul.className = 'tree__list';
        rootLi.appendChild(ul);
      }

      ul.appendChild(newLi);

      rootLi.classList.add('tree__item_root');
      rootLi.classList.add('tree__item_open');
      rootLi.classList.remove('tree__item_close');
    });

    return li;
  }

  _getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getJSON() {
    this._items = this._syncObject(this._elem.querySelector('.tree__core-list'));
    return JSON.stringify(this._items, '', 4);
  }
}


let form = document.querySelector('.inp');
let inp = form.querySelector('input');
let saveBtn = form.querySelector('button');

inp.addEventListener('change', e => {
  console.log('change');
  let reader = new FileReader;
  reader.readAsText(e.target.files[0]);
  reader.addEventListener('load', e => {
    console.log('load');
    let tree = new Tree(JSON.parse(e.target.result));
    document.body.appendChild(tree.getElement());
    form.reset();
  });
});

saveBtn.addEventListener('click', e => {
  var blob = new Blob([tree.getJSON()], {type: "text/plain;charset=utf-8"});
  saveAs(blob, 'tree.json');
});

let tree = new Tree(JSON.parse(json));
document.body.appendChild(tree.getElement());
