import alfy from 'alfy'; 
import Recognizer from 'climbing-grade-recognizer';
import ClimbingGrade from 'climbing-grade';

const sportFormats = ['kurtyki', 'french', 'uiaa', 'yds', 'australian', 'british'];
const boulderFormats = ['font', 'hueco'];

const getTypeFormats = (system) => {
	if (boulderFormats.indexOf(system) >= 0) {
		return boulderFormats;
	}
	return sportFormats;
};

const formatting = {
	kurtyki: "Polish",
	french: "French",
	uiaa: "UIAA",
	yds: "YDS (United States)",
	australian: "Australian",
	british: "British",
	font: "Fontainebleau",
	hueco: "Hueco (United States)"
};

const formatGrade = (gr, system) => {
	const output = [];
	const grade = new ClimbingGrade(gr, system);

	getTypeFormats(system).filter((format) => format !== system).forEach((format) => {
		output.push({
			title: grade.format(format),
			subtitle: formatting[format],
			arg: "open",
			valid: true,
			icon: {
				"path": "./workout.png"
			}
		});
	});
	return output;
};
let system;
let [inputGrade, inputSystem] = alfy.input.split(" ");

try {
	let output = [];

	if (!inputSystem) {
		system = Recognizer.recognize(inputGrade);
		if (system.length > 1) {
			system.forEach((system) => {
				output.push({
					title: `Did you mean ${inputGrade} in ${system} system?`,
					arg: `climb ${inputGrade} ${system}`,
					valid: true
				});
			});
		} else {
			output = formatGrade(inputGrade, system[0]);
		}
	} else {
		output = formatGrade(inputGrade, inputSystem);
	}

	alfy.output(output);
} catch (e) {
	alfy.output([{
		title: 'Grade cannot be converted. ' + system,
		subtitle: e.message
	}]);
}