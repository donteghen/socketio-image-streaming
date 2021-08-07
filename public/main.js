var socket = io.connect();
    let label = document.getElementById('file-label')
    let sendBtn = document.getElementById('send')
    let input = document.getElementById('file');
    let form = document.getElementById('form');
    let uploadBtn = document.getElementById('upload');
    //var imgChunks = [];
    socket.on('img-chunk', function (chunks) {
        var img = document.getElementById('img-stream2');
        document.getElementById('spinner').setAttribute('hidden', true);
        //imgChunks.push(chunk);
        //console.log(imgChunks)
        img.setAttribute('src', 'data:image/jpeg;base64,' + window.btoa(chunks));
    });
   const reset = () => {
    $('#form').attr('hidden', true)
    $('#upload').removeAttr('hidden')
   }
    const sendFile = () => {

        if(!input.files[0]){
            window.alert('no file selected')
            return
        }
        var imageFile = input.files[0],
        reader = new FileReader();
        reader.onloadend = function () {
            socket.emit('upload-image', {
                name: imageFile.name,
                data: reader.result
            });
            reset()
            document.getElementById('spinner').removeAttribute('hidden');
        };
        reader.readAsArrayBuffer(imageFile);
        
    }

    input.addEventListener('input', (e) => {
        const myfile = e.target.files[0]
    })

    // socket.on('image-uploaded', ({path}) => {
    //     let newImage = document.createElement('img');
    //     newImage.setAttribute('src', path)
    //     newImage.setAttribute('width', '100%')
    //     newImage.setAttribute('height', '400px')
    //     uploadBtn.insertAdjacentElement('beforebegin', newImage)
    // })

    socket.on('image-uploaded', (chunks) => {
            let newImage = document.createElement('img');
            newImage.setAttribute('width', '100%')
            newImage.setAttribute('height', '400px')
            document.getElementById('spinner').setAttribute('hidden', true);
            newImage.setAttribute('src', 'data:image/jpeg;base64,' + window.btoa(chunks));
            uploadBtn.insertAdjacentElement('beforebegin', newImage)
            
        })
    
    $(document).ready(function() {
        $('#form').attr('hidden', true)
        $('#send').click(sendFile)
        $('#upload').click(function(e) {
        $('#upload').attr('hidden', true)
        $('#form').removeAttr('hidden')
        })
    });
 