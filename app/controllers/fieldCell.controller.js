export default function fieldCellController($scope, $element) {
    if (this.body) this.sign = angular.element($element).append(this.body);
    console.log(this.sign);
}
