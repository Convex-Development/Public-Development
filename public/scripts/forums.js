document.getElementById('bold-button').addEventListener('click', function() {
    document.execCommand('bold');
});

document.querySelector('#underline-button').addEventListener('click', function() {
    document.execCommand('underline');
});

document.querySelector('#list-button').addEventListener('click', function() {
    document.execCommand('insertUnorderedList');
});

document.querySelector('#editor-text').addEventListener('keyup', FindCurrentTags);
document.querySelector('#editor-text').addEventListener('click', FindCurrentTags);

function FindCurrentTags() {
    var editor_element = document.querySelector('#editor-text');
    
    var num_ranges = window.getSelection().rangeCount;

    var range_parent_tags;

    var all_ranges_parent_tags = [];
        
    var menu_tags = [ 'B', 'UL', 'U' ];
        
    var menu_tags_common = [];

    var start_element,
        end_element,
        cur_element;

    for(var i=0; i<num_ranges; i++) {
        start_element = window.getSelection().getRangeAt(i).startContainer;
        
        end_element = window.getSelection().getRangeAt(i).endContainer;
        
        range_parent_tags = [];

        if(start_element.isEqualNode(end_element)) {
            if(editor_element.isEqualNode(start_element)) {
                all_ranges_parent_tags.push([]);
                continue;
            }

            cur_element = start_element.parentNode;
            
            while(!editor_element.isEqualNode(cur_element)) {
                range_parent_tags.push(cur_element.nodeName);
                cur_element = cur_element.parentNode;
            }
        }

        all_ranges_parent_tags.push(range_parent_tags);
    }

    for(i=0; i<menu_tags.length; i++) {
        var common_tag = 1;
        for(var j=0; j<all_ranges_parent_tags.length; j++) {
            if(all_ranges_parent_tags[j].indexOf(menu_tags[i]) == -1) {
                common_tag = -1;
                break;
            }
        }

        if(common_tag == 1)
            menu_tags_common.push(menu_tags[i]);
    }

    if(menu_tags_common.indexOf('B') != -1)
        document.querySelector("#bold-button").classList.add("highight-menu");
    else
        document.querySelector("#bold-button").classList.remove("highight-menu");

    if(menu_tags_common.indexOf('U') != -1)
        document.querySelector("#underline-button").classList.add("highight-menu");
    else
        document.querySelector("#underline-button").classList.remove("highight-menu");

    if(menu_tags_common.indexOf('UL') != -1)
        document.querySelector("#list-button").classList.add("highight-menu");
    else
        document.querySelector("#list-button").classList.remove("highight-menu");
}
