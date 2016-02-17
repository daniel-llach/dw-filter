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
false, inner, outer
### config
### data

## Val

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
