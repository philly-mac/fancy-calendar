var FancyCalendar = function(options) {

  var self = this

  this.getFromDate = function() {
    var fromDate = null;
    try { fromDate = $.datepicker.parseDate(this.options['dateFormat'], $(this.options['fromDateKey']).val()); } catch(error) { console.log(error); }
    return fromDate;
  }

  this.getToDate = function() {
    var toDate = null;
    try { toDate = $.datepicker.parseDate(this.options['dateFormat'], $(this.options['toDateKey']).val()); } catch(error) { console.log(error); }
    return toDate;
  }

  this.setToCalendarMinDate = function() {
    var fromDate = this.getFromDate();

    if (fromDate != null) {
      var minDaysBeetweenStartAndEnd = this.options['minDaysBeetweenStartAndEnd'];

      for (i = 0; i < minDaysBeetweenStartAndEnd; i++) {
        fromDate = fromDate.add('d', 1);
      }

      $(this.options['toDateKey']).datepicker('option','minDate', fromDate);
    }

    this.setFormValues();
  }

  // Translates the dates in the format that is shown to the dates
  // that are sent to the sever and sets the hidden fields to those values
  this.setFormValues = function() {
    var fromDate = this.getFromDate();
    console.log(fromDate);
    var toDate = this.getToDate();

    if (fromDate != null) { $(this.options['fromDateValueKey']).val(fromDate.format(this.options['dateClassStoredFormat'])); }
    if (toDate != null) { $(this.options['toDateValueKey']).val(toDate.format(this.options['dateClassStoredFormat'])); }
  }

  // Lower level utilities
  this.hashMerge = function(source, destination) {
    for (var property in source) {
      if (destination[property] == null || destination[property] == undefined) {
        destination[property] = source[property];
      }
    }

    return destination;
  }

  this.defaultOptions = {
    fromDateKey:                '',
    toDateKey:                  '',
    fromDateValueKey:           '',
    toDateValueKey:             '',
    calendarDivKey:             "#ui-datepicker-div",
    dateFormat:                 "dd/M/yy D",
    dateClassStoredFormat:      "yyyy-M-dd",
    defaultDateValue:           "",
    numberOfMonths:             2,
    dragableCalendar:           false,
    minDaysBeetweenStartAndEnd: 0,
    language:                   '',
    popUpCalendar:              true,
    minDate:                    0,
    maxDate:                    "+52w",
  };

  this.options = this.hashMerge(this.defaultOptions, options);

  this.fromDateHash = {
    numberOfMonths: this.options['numberOfMonths'],
    showButtonPanel: true,
    minDate: this.options['minDate'],
    maxDate: this.options['maxDate'],
    dateFormat: this.options['dateFormat'],
    onSelect: function(dateText, inst) {
      self.setToCalendarMinDate();
      $(self.options['fromDateKey']).blur();
    }
  };

  this.toDateHash = {
    numberOfMonths: this.options['numberOfMonths'],
    showButtonPanel: true,
    minDate: this.options['minDate'],
    maxDate: this.options['maxDate'],
    dateFormat: this.options['dateFormat'],
    onSelect: function(dateText, inst) {
      self.setFormValues();
      $(self.options['toDateKey']).blur();
    }
  };

  if (this.options['language'] != null && this.options['language'] != 'en') {
    this.fromDateHash = this.hashMerge($.datepicker.regional[this.options['language']], this.fromDateHash);
    this.toDateHash = this.hashMerge($.datepicker.regional[this.options['language']], this.toDateHash);
  } else {
    // The key for English is empty string
    this.fromDateHash = hashMerge($.datepicker.regional[''], this.fromDateHash);
    this.toDateHash = hashMerge($.datepicker.regional[''], this.toDateHash);
  }

  // Sets the form fields to pop up the calendar when clicked
  $(this.options['fromDateKey']).datepicker(this.fromDateHash);
  $(this.options['toDateKey']).datepicker(this.toDateHash);

  if (this.options['dragableCalendar']) {
    // Makes the calendar draggable
    $(this.options['calendarDivKey']).draggable();
  }

  if (this.options['popUpCalendar']) {
    // Responds to the click event on the fields and pops up the calendar
    $(this.options['fromDateKey']).click(function () { $(this).select(); });
    $(this.options['toDateKey']).click(function () { $(this).select(); });
  }

  // This makes it so that you cannot select dates on the 'to' calendar
  // that are before the date on the 'from'
  this.setToCalendarMinDate();
}
