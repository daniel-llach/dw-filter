# dw-filter (under construction...)
A filter component for darwinEd.

# 1.- Install
```javascript
  bower install --save dw-filter
```

# 2.- Use
```javascript
$('#id').dwFilter();
```

# 3.- API
## Create
If the dwFilter() class has an object the API interprets that is a new element and create it.

The API accepts the next configurations:

### title
### type
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


### Example:
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
