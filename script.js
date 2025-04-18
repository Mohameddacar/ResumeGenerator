// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

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
    const skills = document.getElementById('skills').value;
    const experience = document.getElementById('experience').value;

    // Update name
    document.getElementById('previewName').textContent = name;

    // Update skills
    const skillsContainer = document.getElementById('previewSkills');
    skillsContainer.innerHTML = '';
    skills.split(',').forEach(skill => {
        if (skill.trim()) {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill';
            skillElement.textContent = skill.trim();
            skillsContainer.appendChild(skillElement);
        }
    });

    // Update experience
    const experienceContainer = document.getElementById('previewExperience');
    experienceContainer.innerHTML = '';
    experience.split('\n').forEach(exp => {
        if (exp.trim()) {
            const expElement = document.createElement('div');
            expElement.className = 'experience-item';
            const [company, position, years] = exp.split('-').map(item => item.trim());
            expElement.innerHTML = `
                <strong>${position || 'Position'}</strong>
                <p>${company || 'Company'}${years ? ` • ${years}` : ''}</p>
            `;
            experienceContainer.appendChild(expElement);
        }
    });

    // Show download button
    document.getElementById('downloadPDF').style.display = 'block';
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