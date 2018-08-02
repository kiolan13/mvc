
<head>
    <link href="/style/style.css" rel="stylesheet" type="text/css">
        <link href="/style/trix.css" rel="stylesheet" type="text/css">
            <script src="/script/jquery-3.3.1.min.js">
            </script>
            <script src="/script/trix.js">
            </script>
        </link>
    </link>
</head>
<body>

<h2 id='pagedescription'>
    Create product
</h2>
<div id="info"></div>
    <div class="basediv">
        <br>
            <label for="name">
                Name:
            </label>
            <input id="name" type="text"/>
            <br>
                <label for="price">
                    Price:
                </label>
                <input id="price" type="text"/>
                <br>
                    <label for="description">
                        Description:
                    </label>
                    <div class="description" id="description">
                        <form …="">
                            <input id="x" name="content" type="hidden">
                                <trix-editor input="x">
                                </trix-editor>
                            </input>
                        </form>
                    </div>
                    <br>
                        <img class="image"/>
                        <br>
                        </br>
                    </br>
                </br>
            </br>
        </br>
    </div>
    <label class="customuploadlabel" for="loadImage">
        Custom Upload
    </label>
    <input class="loadImageButton" id="loadImage" type="file" value="load image"/>
    <br>
        <input class="saveButton" type="button" value="Save"/>
    </br>
</body>
<script src="/script/adminScript.js" type="text/javascript">
</script>
