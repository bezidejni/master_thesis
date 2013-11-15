(function() {
    console.log("dsadsa");
        console.log("sadsa");
        var lista = window.getElementsByClassName('js-preprocessed-urls');
        chrome.devtools.inspectedWindow.eval(
            "document.getElementsByTagName('div').length",
            function(result, isException) {
              if (isException) throw new Error('Eval failed for ' + expr, isException.value);

                var li = document.createElement('li');
                li.textContent = "Number of div elements: " + result;
                lista.appendChild(li);
            }
        );
})();