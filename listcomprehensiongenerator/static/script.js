$(document).ready(function(){
    // Configure SweetAlert2 notifications
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    // Handle form submission
    $('#listForm').submit(function(event){
        event.preventDefault();

        // Make AJAX request to the server
        $.ajax({
            type: 'POST',
            url: '',
            data: $('#listForm').serialize(),
            success: function(response){
                // Handle success response from the server
                if (response.error) {
                    // Handle server-side error
                    Toast.fire({
                        icon: 'error',
                        title: response.error
                    });
                } else {
                    // Handle successful response
                    var codeBlock = ''+response.result;
                    console.log(response.result)

                    // response.results.forEach(function(resultList) {
                    //     var resultString = '[' + resultList.join(', ') + ']';
                    //     codeBlock += resultString + '\n';
                    // });

                    var codeContainer = '<div class="code-container"><pre><code class="code-block">' + codeBlock + '</code></pre><button class="copy-button">Copy</button></div>';
                    $('#resultDiv').hide().html(codeContainer).fadeIn('slow');

                    // Handle copy functionality
                    $('.copy-button').click(function(){
                        var tempTextArea = $('<textarea>');
                        tempTextArea.text(codeBlock);
                        $('body').append(tempTextArea);
                        tempTextArea.select();
                        document.execCommand('copy');
                        tempTextArea.remove();

                        // Show success notification after copying
                        Toast.fire({
                            icon: 'success',
                            title: 'Copied successfully'
                        });
                    });
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                // Handle different error scenarios
                if (xhr.status === 400) {
                    // Handle client-side validation error
                    var errorResponse = xhr.responseJSON;
                    if (errorResponse && errorResponse.error) {
                        // Handle specific error message from the server
                        Toast.fire({
                            icon: 'error',
                            title: errorResponse.error
                        });
                    } else {
                        // Handle generic client-side error
                        Toast.fire({
                            icon: 'error',
                            title: 'One of your input and output pair lengths do not match. Please try again.'
                        });
                    }
                } else {
                    // Handle other server-side errors
                    Toast.fire({
                        icon: 'error',
                        title: 'Failed to generate code. Please try again later.'
                    });
                }
            }
        });
    });


    var pairIndex = 1;
    $("#addPair").click(function(){
        pairIndex++;
        var inputFields = '<div class="input-group">';
        inputFields += `<h3>Pair ${pairIndex}</h3>`;
        inputFields += '<label for="list1">Input List</label>';
        inputFields += '<input type="text" name="list1[]" placeholder="comma separated values: 1,2..."  required><br>';
        inputFields += '<label for="list2">Output List </label>';
        inputFields += '<input type="text" name="list2[]" placeholder="comma separated values: 1,2..." required><br>';
        inputFields += '</div>';
        $("#inputPairs").append(inputFields);

        Toast.fire({
            icon: 'success',
            title: 'Added the Pair successfully'
        });
    });

    $("#removePair").click(function(){
        if ($("#inputPairs .input-group").length > 1) {
            $("#inputPairs .input-group:last-child").remove();
            pairIndex--;
        }
        Toast.fire({
            icon: 'success',
            title: 'Removed the Pair successfully'
        });
    });

    $("#clearAll").click(function(){
        $("#inputPairs").empty();
        $("#inputPairs").append('<div class="input-group">' +
                                    '<h3>Pair 1</h3>'+
                                    '<label for="list1">Input List </label>' +
                                    '<input type="text" name="list1[]"  placeholder="comma separated values: 1,2..." required><br>' +
                                    '<label for="list2">Output List </label>' +
                                    '<input type="text" name="list2[]"  placeholder="comma separated values: 1,2..." required><br>' +
                                '</div>');
        pairIndex = 1;
        Toast.fire({
            icon: 'success',
            title: 'Cleared all the Pairs successfully'
        });
    });
});

