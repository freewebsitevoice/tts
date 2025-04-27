<!-- WebsiteVoice Widget -->
					(function (d, s, id) {
						var js, fjs = d.getElementsByTagName(s)[0];
						if (d.getElementById(id)) return;
						js = d.createElement(s); js.id = id;
						js.src = "https://websitevoice.com/js/widget.js";
						js.async = true;
						fjs.parentNode.insertBefore(js, fjs);
					}(document, 'script', 'websitevoice-sdk'));


					window.wvSettings = {
						siteId: 'YOUR_WEBSITEVOICE_SITE_ID',
						voice: 'en-US-JennyNeural',
						language: 'en-US'
					};
			
    <!-- Web Speech API without Highlighting -->

        const synth = window.speechSynthesis;
        let utterance = null;
        let isPlaying = false;

        // Split article into words and wrap each in a span (to match provided HTML)
        function prepareText() {
            const article = document.getElementById('article');
            if (!article) {
                console.error('Article element not found');
                return;
            }
            const paragraphs = article.querySelectorAll('p');
            let wordId = 0;
            let charPosition = 0;

            paragraphs.forEach((para) => {
                const text = para.textContent;
                const wordArray = text.split(/\s+/).filter(word => word.length > 0);
                const wordSpans = wordArray.map((word, index) => {
                    const span = document.createElement('span');
                    span.className = 'word';
                    span.id = `word-${wordId++}`;
                    span.textContent = word + ' ';
                    return span;
                });

                // Replace paragraph content with spanned words
                para.innerHTML = '';
                wordSpans.forEach(span => para.appendChild(span));
            });
        }

        // Initialize text preparation
        try {
            prepareText();
        } catch (e) {
            console.error('Error preparing text:', e);
        }

        document.getElementById('play').addEventListener('click', () => {
            if (!isPlaying) {
                try {
                    const text = document.getElementById('article').textContent;
                    if (!text.trim()) {
                        console.warn('No text to read');
                        return;
                    }
                    utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'en-US';
                    utterance.rate = 0.92;
                    utterance.pitch = 1.0;

                    utterance.onend = () => {
                        isPlaying = false;
                    };

                    synth.speak(utterance);
                    isPlaying = true;
                } catch (e) {
                    console.error('Error during playback:', e);
                }
            } else if (synth.paused) {
                try {
                    synth.resume();
                } catch (e) {
                    console.error('Error resuming playback:', e);
                }
            }
        });

        document.getElementById('pause').addEventListener('click', () => {
            if (isPlaying && !synth.paused) {
                try {
                    synth.pause();
                } catch (e) {
                    console.error('Error pausing playback:', e);
                }
            }
        });

        document.getElementById('stop').addEventListener('click', () => {
            if (isPlaying) {
                try {
                    synth.cancel();
                    isPlaying = false;
                } catch (e) {
                    console.error('Error stopping playback:', e);
                }
            }
        });
