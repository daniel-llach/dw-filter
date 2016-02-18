# dw-filter (under construction...)
A filter component for darwinEd.

# 1.- Install
1.1.- Install dependencies from bower:
```javascript
  bower install --save dw-filter
```
1.2.- Include dependencies in html:
```html
<!-- dw-filter dependencies -->
<script src="./bower_components/jquery/dist/jquery.min.js"></script>
<script src="./component/dw-filter.js"></script>
<link rel="stylesheet" type="text/css" href="./component/dw-filter.css">
```

# 2.- Use
Execute the dwFilter class on a selector. It will be rendered a dw-filter element in this container inherit its position and width.
```javascript
$('#id').dwFilter();
```

# 3.- API
## 3.1.- Init
If the dwFilter() class has an object the API interprets that is a new element and create it.

The API accepts the next configurations:

### 3.1.1.- title
### 3.1.2.- type
· **checkbox**: List of checkboxes. An example:
```javascript
$('#id').dwFilter({
  title: 'Origen',
  type: 'checkbox',
  search: true,
  config: {
    key_attr: 'id',
    value_attr: 'content'
  },
  data: [
    {
      id: 4522,
      content: 'Real'
    },
    {
      id: 5645,
      content: 'Proyección 1'
    },
    {
      id: 2378,
      content: 'Proyección 2'
    }
  ]
});
```
· **selectChain** List of selects


### 3.1.3.- search

If is not define this attribute no show the search input on the element template.
The possible options are:

· **inner**: Filter the options in the dw-filter element

· **outer**: Return the string into the search input when you realize a **val** methods

### 3.1.4.- config
### 3.1.5.- data

## 3.2.- Val
```javascript
$('#id').dwFilter('val');
```
Return the follow structure:
```javascript
{
  search: '',
  data: []
}
```
the **search** is the string of the **outer** .

The **data** property is specific by **type** as follow:

· **chekbox**:
[<img src="https://github.com/daniel-llach/dw-filter/blob/master/img/checkbox.png?raw=true">]
Array of change ids in options
```
{
  search: '',
  data: [23, 78, 44]
}
```

## 3.2.- Destroy
This methods empty the container div and remove class too.
```javascript
$('#id').dwFilter('destroy');
```

# 4.- Demo
You can view a local demo installing the component and open /bower_components/dw-filter/index.html in your browser (localhost/your_rute).

You must change the bower_components dependencies rutes as follow:
```html
<script src="../jquery/dist/jquery.min.js"></script>
<script src="../underscore/underscore-min.js"></script>
```
