document.getElementById('fetchButton').addEventListener('click', function(e) {
    e.preventDefault();
    
    var fetchButton = document.getElementById('fetchButton');
    // Grey out the button and make it unclickable
    fetchButton.classList.add('disabled');

    var jobDescription = document.getElementById('firstField').value;

    fetch('https://perfect-compassion-295eb47db8.strapiapp.com/api/checktitle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jobdescription: jobDescription
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('otherField').value = data.job;
        document.getElementById('jobTitle').innerText = data.job;
	document.getElementById('lowerRate').innerText = data.rates.lowerRate;
        document.getElementById('higherRate').innerText = data.rates.higherRate;
	document.getElementById('juniorRate').innerText = data.rates.lowerRate;
        document.getElementById('seniorRate').innerText = data.rates.higherRate;

        // Populate the skillsContainer
        var skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.innerHTML = ''; // Clear the container

        // Function to add click event to a span
        var addClickListener = function(span) {
            span.addEventListener('click', function() {
                var currentInput = document.getElementById('otherField2').value;
                var currentSkills = currentInput.length > 0 ? currentInput.split(', ') : [];
                var index = currentSkills.indexOf(this.textContent);
                var lowerCardDiv = document.getElementById('lowerCard');

                if (index === -1) {  // If the skill is not currently in the input field
                    // Add the skill to the input field
                    currentSkills.push(this.textContent);
                    // Change the background color to green
                    this.style.backgroundColor = '#0dbb52';
                    this.style.color = 'white';
                    // Create a span in the lowerCard div for this skill
                    var skillLabelLowerCard = document.createElement('span');
                    skillLabelLowerCard.textContent = this.textContent;
                    skillLabelLowerCard.className = 'skillLabel';
                    lowerCardDiv.appendChild(skillLabelLowerCard);
                } else {  // If the skill is already in the input field
                    // Remove the skill from the input field
                    currentSkills.splice(index, 1);
                    // Change the background color back to its initial color
                    this.style.backgroundColor = '#eee';
                    // Remove the corresponding span from the lowerCard div
                    var spans = lowerCardDiv.getElementsByClassName('skillLabel');
                    for (var i = 0; i < spans.length; i++) {
                        if (spans[i].textContent === this.textContent) {
                            lowerCardDiv.removeChild(spans[i]);
                            break;
                        }
                    }
                }

                // Update the value of the input field
                document.getElementById('otherField2').value = currentSkills.join(', ');
            });
        };

        // Loop through the skills and create a span for each one
        data.skills.skill.forEach(skillObj => {
            var skillLabel = document.createElement('span');
            skillLabel.textContent = skillObj.name + " (" + skillObj.amount + ")";
            skillLabel.className = 'skillLabel'; // Apply the label style

            addClickListener(skillLabel);

            skillsContainer.appendChild(skillLabel);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

$(function() {
    fetch('https://perfect-compassion-295eb47db8.strapiapp.com/api/totalskills')
    .then(response => response.json())
    .then(data => {
        // The skills array is deeply nested within the data object
        var skillNames = data.data[0].attributes.allSkills.totalskills;

        jQuery_1_12_1("#skillInput").autocomplete({
            source: skillNames,
            select: function(event, ui) {
                event.preventDefault();
                var currentSkillsContainer = document.getElementById('skillsContainer');
                var skillLabel = document.createElement('span');
                skillLabel.textContent = ui.item.value;
                skillLabel.className = 'skillLabel';

                // Add the click event listener to the new skillLabel
                addClickListener(skillLabel);

                // Append the new skillLabel to the skillsContainer
                currentSkillsContainer.appendChild(skillLabel);

                // Trigger the click event programmatically
                skillLabel.click();

                // Clear the autocomplete input
                jQuery_1_12_1(this).val('');
            }
        });
    });

    function addClickListener(span) {
        span.addEventListener('click', function() {
            var currentInput = document.getElementById('otherField2').value;
            var currentSkills = currentInput.length > 0 ? currentInput.split(', ') : [];
            var index = currentSkills.indexOf(this.textContent);
            var lowerCardDiv = document.getElementById('lowerCard');

            if (index === -1) {  // If the skill is not currently in the input field
                // Add the skill to the input field
                currentSkills.push(this.textContent);
                // Change the background color to green
                this.style.backgroundColor = 'green';
                // Create a span in the lowerCard div for this skill
                var skillLabelLowerCard = document.createElement('span');
                skillLabelLowerCard.textContent = this.textContent;
                skillLabelLowerCard.className = 'skillLabel';
                lowerCardDiv.appendChild(skillLabelLowerCard);
            } else {  // If the skill is already in the input field
                // Remove the skill from the input field
                currentSkills.splice(index, 1);
                // Change the background color back to its initial color
                this.style.backgroundColor = '#eee';
                // Remove the corresponding span from the lowerCard div
                var spans = lowerCardDiv.getElementsByClassName('skillLabel');
                for (var i = 0; i < spans.length; i++) {
                    if (spans[i].textContent === this.textContent) {
                        lowerCardDiv.removeChild(spans[i]);
                        break;
                    }
                }
            }
            // Update the value of the input field
            document.getElementById('otherField2').value = currentSkills.join(', ');
        });
    }
});

