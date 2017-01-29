export default class DropDownTreeController {
	constructor(
		$log,
		$document,
		$element,
		$rootScope,
	) {
		'ngInject';

		this.$log = $log;
		this.$document = $document;
		this.$element = $element;
		this.$rootScope = $rootScope;

		this.open = false;
		this.selectedOptions = [];

		this.texts = {
			optionNames: 'items',
		};

		this.settings = {
			displayProperty: 'name',
			childrenProperty: 'children',
			closeOnBlur: true,
			selectedClass: [
				'glyphicon',
				'glyphicon-ok',
			],
		};
	}

	$onChanges(changes) {
		if (angular.isDefined(changes.externalTexts)) {
			angular.extend(this.texts, this.externalTexts);
		}
		if (angular.isDefined(changes.externalSelection)) {
			if (angular.isArray(changes.externalSelection)) {
				this.selectedOptions = this.externalSelection;
				this.emitSelection();
			} else {
				this.$log.error('selection should be an array');
			}
		}
		if (angular.isDefined(changes.externalSettings)) {
			angular.extend(this.settings, this.externalSettings);
		}
	}

	toggleDropdown() {
		this.open = !this.open;
		if (this.open && this.settings.closeOnBlur) {
			this.closeToggleOnBlurBinded = this.toggleOnBlur.bind(this);
			this.$document.on('click', this.closeToggleOnBlurBinded);
		}
	}

	toggleOnBlur(e) {
		if (e.target && e.target.parentElement) {
			let target = e.target.parentElement;
			let parentFound = false;

			while (angular.isDefined(target) && target !== null && !parentFound) {
				if (!!target.className.split && target.className.split(' ').indexOf('dropdown-tree-parent') >= 0 && !parentFound) {
					if (target === this.$element.children()[0]) {
						parentFound = true;
					}
				}
				target = target.parentElement;
			}

			if (!parentFound) {
				this.$rootScope.$apply(() => {
					this.toggleDropdown();
					this.$document.off('click', this.closeToggleOnBlurBinded);
				});
			}
		}
	}

	optionClicked(option) {
		const indexOfOption = this.selectedOptions.indexOf(option);
		if (indexOfOption >= 0) {
			this.selectedOptions.splice(indexOfOption, 1);
		} else {
			this.selectedOptions.push(option);
		}
		this.emitSelection();
	}

	emitSelection() {
		this.selectionChanged({ selection: this.selectedOptions });
	}
}