# dw-typeahead
A typeahead component for DarwinEd app

<!-- <img src="https://raw.githubusercontent.com/daniel-llach/dw-typeahead/master/img/img1.png"> -->
<img src="https://raw.githubusercontent.com/daniel-llach/dw-typeahead/master/img/img2.png">

* live example: http://daniel-llach.github.io/dw-typeahead/

**dwTypeahead** show *options* divide into *groups*, one option can be insert in many groups.

Every **option** has a *primary text* that is the main content and a *secundary* text that is a context or specific content for that options

**dwTypeahead** has its own *search sintax*:

## filter all options:

<img src="https://raw.githubusercontent.com/daniel-llach/dw-typeahead/master/img/img2b.png">

Just type what you want and *dwTypeahead* search you text into **all primary and secondly content in every groups**

## filter by groups

<img src="https://raw.githubusercontent.com/daniel-llach/dw-typeahead/master/img/img3.png">

If yo begin typing whit a **colon** ( **:** ), *dwTypeahead* interprets that you want to **search by groups, and show only the groups that match whit you text**.

## filter by groups and options

<img src="https://raw.githubusercontent.com/daniel-llach/dw-typeahead/master/img/img4.png">

If you filter by groups and add a **space** the next word **filter the options o the filter groups**.


# Index

---

# 1.- Install

---

1.1.- Install dependencies from bower into your project

```javascript
  bower install --save dw-typeahead
```

---

1.2.- Include dependencies in your html:

```html
<!-- dw-typeahead dependencies -->
<script src="./bower_components/jquery/dist/jquery.min.js"></script>
<script src="./component/dw-typeahead.js"></script>
<link rel="stylesheet" type="text/css" href="./component/dw-typeahead.css">
```

---

# 2.- Use

---

Execute the dwTypeahead class on a selector. It will be rendered a dw-typeahead element in this container inherit its position and width.

```javascript
$('#id').dwTypeahead();
```

 ---

# 3.- API

 ---


## 3.1.- Init
If the dwTypeahead() class has an object the API interprets that is a new element and create it.


The API accepts the next configurations:

### 3.1.- placeholder:

Put the placeholder text that you want.
```javascript
$('#sample1').dwTypeahead({
  placeholder: 'Select your animal'
})
```

### 3.2.- data:
dwTypeahead recives the next configuration:

```javascript
$('#sample1').dwTypeahead({
  placeholder: 'Select your animal',
  data: [
    {
      id: 1,
      primary: 'Cat',
      secundary: 'Gray',
      selected: false,
      group: ['feline']
    },
    {
      id: 2,
      primary: 'Dog',
      secundary: 'White',
      selected: false,
      group: ['canine']
    },
  ]
});
```

The next are the fields of an option object:

- **id:** An identifier

- **primary:** The text that show in the first line of an option

- **secundary:** The text that show in the second line of an option

- **selected:** Indicate if this particular options has selected

- **group:** The groups where the option will be inserted, one option can be insert in many groups

---

## 3.3.- Destroy
This methods empty the container div and remove class too.
```javascript
$('#id').dwTypeahead('destroy');
```

---

# 4.- Listeners

---

When one option was selected dwTypeahead trigger a change events that you can listen as follow:

```javascript
$('#id').on({
  change: function(event){
    var result = $('#id').data('result');
    console.log("sample1 data: ", result);
  }
});
```

---

# 5.- Demo

---

You can view a local demo installing the component and open /bower_components/dw-typeahead/**index.html** in your browser (localhost/your_rute).

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
