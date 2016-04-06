# dw-list
---

A list component for **DarwinEd** app

<img srch="https://raw.githubusercontent.com/daniel-llach/dw-list/master/img/img1.png">


- live example: http://daniel-llach.github.io/dw-list/

**dw-list** show a sortable list of items, that support _single_ al _double lines_ of content

---

# 1.- Install

---

1.1.- Install dependencies from bower into your project

```javascript
  bower install --save dw-list
```

---

1.2.- Include dependencies in your html:

```html
<!-- dw-typeahead dependencies -->
<script src="./bower_components/jquery/dist/jquery.min.js"></script>
<script src="./component/dw-list.js"></script>
<link rel="stylesheet" type="text/css" href="./component/dw-list.css">
```

---

# 2.- Use

---

Execute the dwList class on a selector. It will be rendered a dw-typeahead element in this container inherit its position and width.

```javascript
$('#id').dwList();
```

 ---

# 3.- API

 ---

 ## 3.1.- Init
If the dwList() class has an object the API interprets that is a new element and create it.


The API accepts the next configurations:

### 3.1.1- Orientation:

Determine the form that show the items of the list _vertical_ and _horizontal_. For now *dwList* support only *vertical*

### 3.1.2- Type

The way of how the user can interact with the items, the projected options for this are: *priority*, *order* and *change*.

*dwList* support the following options:

- *Change*: The user can swap to items no affect anything else
- *Order*: The user can swap to items no affect anything else

### 3.1.3- Sortable

If is *true* active the drag and drop interface, if you do not want simply don't include the sortable option.

### 3.1.4- Data

The data receives the next structure:
```javascript
{
  id: 1,  
  primary: 'Cat',     // show in first line
  secondary: 'Gray'   // show in second line
}
```
- If secondary no exist dwList show automatically only one line.

### 3.1.5- Add Items

Indicate just an array of items objects as shown below:

```javascript
$('#id').dwList({
  add:[
    {
      id: 12,
      primary: 'Nutria'
    }
  ]
})
```

### 3.1.5- Destroy
This methods empty the container div and remove class too.
```javascript
$('#id').dwList('destroy');
```


---

# 5.- Demo

---

You can view a local demo installing the component and open /bower_components/dw-list/**index.html** in your browser (localhost/your_rute).

You must change the bower_components dependencies rutes as follow:

```html
<script src="../jquery/dist/jquery.min.js"></script>
<script src="../underscore/underscore-min.js"></script>
```

---

# 6.- Possible problems

---

### 6.1.- Don't show svg background-image:

Confirm that your server are serving well the svg files, add to your ***.htacces*** the follow:
```bash
AddType image/svg+xml .svg .svgz
```
