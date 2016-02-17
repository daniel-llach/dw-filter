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
Execute the dwFilter class on a selector. It will be rendered in this container and inherit its width.
```javascript
$('#id').dwFilter();
```

# 3.- API
## Create
If the dwFilter() class has an object the API interprets that is a new element and create it.

The API accepts the next configurations:

### title
### type
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


### search

If is not define this attribute no show the search input on the element template.
The possible options are:

· **inner**: Filter the options in the dw-filter element

· **outer**: Return the string into the search input when you realize a **val** methods

### config
### data

## Val
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

· **chekbox**: Array of change ids in options
```
{
  search: '',
  data: [23, 78, 44]
}
```

## Destroy

## Demo
You can view a local demo installing the component and open /bower_components/dw-filter/index.html in your browser (localhost/your_rute).

You must change the bower_components dependencies rutes as follow:
```html
<script src="../jquery/dist/jquery.min.js"></script>
<script src="../underscore/underscore-min.js"></script>
```
