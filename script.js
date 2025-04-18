// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

// Handle profile photo
let profilePhotoData = null;
document.getElementById('photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePhotoData = e.target.result;
            document.getElementById('previewPhoto').style.backgroundImage = `url(${profilePhotoData})`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('resumeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateResume();
});

document.getElementById('downloadPDF').addEventListener('click', function() {
    generatePDF();
});

function generateResume() {
    // Get form values
    const name = document.getElementById('name').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;
    const education = document.getElementById('education').value;
    const experience = document.getElementById('experience').value;

    // Update name
    document.getElementById('previewName').textContent = name;

    // Update summary
    document.getElementById('previewSummary').textContent = summary;

    // Update skills
    const skillsContainer = document.getElementById('previewSkills');
    skillsContainer.innerHTML = '';
    skills.split('\n').forEach(skill => {
        if (skill.trim()) {
            const li = document.createElement('li');
            li.textContent = skill.trim();
            skillsContainer.appendChild(li);
        }
    });

    // Update education
    const educationContainer = document.getElementById('previewEducation');
    educationContainer.innerHTML = '';
    education.split('\n').forEach(edu => {
        if (edu.trim()) {
            const [degree, institution, year] = edu.split('-').map(item => item.trim());
            const eduElement = document.createElement('div');
            eduElement.className = 'education-item';
            eduElement.innerHTML = `
                <h3>${degree || 'Degree'}</h3>
                <div class="institution">${institution || 'Institution'}${year ? ` • ${year}` : ''}</div>
            `;
            educationContainer.appendChild(eduElement);
        }
    });

    // Update experience
    const experienceContainer = document.getElementById('previewExperience');
    experienceContainer.innerHTML = '';
    let currentExp = {
        position: '',
        company: '',
        duration: '',
        description: []
    };

    experience.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '---') {
            if (currentExp.position) {
                addExperienceItem(currentExp, experienceContainer);
            }
            currentExp = {
                position: '',
                company: '',
                duration: '',
                description: []
            };
        } else if (trimmedLine) {
            if (!currentExp.position) {
                currentExp.position = trimmedLine;
            } else if (!currentExp.company) {
                currentExp.company = trimmedLine;
            } else if (!currentExp.duration) {
                currentExp.duration = trimmedLine;
            } else {
                currentExp.description.push(trimmedLine);
            }
        }
    });

    // Add the last experience item if exists
    if (currentExp.position) {
        addExperienceItem(currentExp, experienceContainer);
    }

    // Show download button
    document.getElementById('downloadPDF').style.display = 'block';
}

function addExperienceItem(exp, container) {
    const expElement = document.createElement('div');
    expElement.className = 'experience-item';
    expElement.innerHTML = `
        <h3>${exp.position}</h3>
        <div class="company">${exp.company}</div>
        <div class="duration">${exp.duration}</div>
        ${exp.description.length ? `<ul>${exp.description.map(desc => `<li>${desc}</li>`).join('')}</ul>` : ''}
    `;
    container.appendChild(expElement);
}

async function generatePDF() {
    const resumeElement = document.getElementById('resumePreview');
    const name = document.getElementById('name').value;

    try {
        // Create canvas from resume element
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            backgroundColor: '#ffffff'
        });

        // Initialize PDF
        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        });

        // Calculate dimensions to fit the resume on the page
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;

        // Add the image to the PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

        // Save the PDF
        pdf.save(`${name.replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    }
} 