var tasks = {
    list: function (from, to, source) {
        var data;
        if (source === 'main') {
            data = user.tasks();
        } else {
            data = user.search();
        }
        var out = '';
        if (data !== '') {
            $.each(data, function (index, row) {
                if (index >= from && index <= to) {
                    out = out + '<a href="#" class="task" onclick="changePage(\'task_detail?id=' + row.id + '\');">' + row.no + ' - ' + row.name + '</a>';
                }
            });
        }
        if (out !== '') {
            $('#tasks_list').empty();
            $('#tasks_list').append(out);
        }
        tasks.navigations('tasks', from, to, data.length, source);
    },
    navigations: function (page, start, end, max, source) {
        max = max - 1;
        var next = end + 1;
        switch (page) {
            case 'tasks':
                var prev = start - config.limit;
                if (prev < 0) {
                    $('#' + page + ' .nav-container .prev').addClass('disabled');
                    $('#' + page + ' .nav-container .prev').removeAttr('onclick');
                } else {
                    $('#' + page + ' .nav-container .prev').removeClass('disabled');
                    $('#' + page + ' .nav-container .prev').attr('onclick', 'tasks.list(' + prev + ',' + (start - 1) + ', "' + source + '");');
                }
                if (next > max) {
                    $('#' + page + ' .nav-container .next').addClass('disabled');
                    $('#' + page + ' .nav-container .next').removeAttr('onclick');
                } else {
                    $('#' + page + ' .nav-container .next').removeClass('disabled');
                    $('#' + page + ' .nav-container .next').attr('onclick', 'tasks.list(' + next + ',' + (end + config.limit) + ', "' + source + '");');
                }
                break;
            case 'category':
                var prev = start - config.cat_limit;
                if (prev < 0) {
                    $('#' + page + ' .nav-container .prev').addClass('disabled');
                    $('#' + page + ' .nav-container .prev').removeAttr('onclick');
                } else {
                    $('#' + page + ' .nav-container .prev').removeClass('disabled');
                    $('#' + page + ' .nav-container .prev').attr('onclick', 'tasks.listCategories(' + source + ', ' + prev + ',' + (start - 1) + ');');
                }
                if (next > max) {
                    $('#' + page + ' .nav-container .next').addClass('disabled');
                    $('#' + page + ' .nav-container .next').removeAttr('onclick');
                } else {
                    $('#' + page + ' .nav-container .next').removeClass('disabled');
                    $('#' + page + ' .nav-container .next').attr('onclick', 'tasks.listCategories(' + source + ', ' + next + ',' + (end + config.limit) + ');');
                }
                break;
        }
    },
    getById: function (id) {
        var data = user.tasks();
        var rs;
        $.each(data, function (index, row) {
            if (parseInt(row.id) === parseInt(id)) {
                rs = row;
                return false;
            }
        });
        return rs;
    },
    expand: function (id) {
        var data = tasks.getById(id);
        $('#task_id').val(id);
        $('#cname').val(data.name);
        $('#cno').val(data.no);
        $('#clocation').val(data.address);
        $('#conductby').val(user.name());
        jQuery('#conductdt').datetimepicker({
            format: 'd/m/Y g:i A',
            formatTime: 'g:i A',
            showOn: 'button',
            onClose: function (dateText, inst) {
                $(this).attr('disabled', false);
            },
            beforeShow: function (input, inst) {
                $(this).attr('disabled', true);
            }
        });
        $('#attachment').click(function () {
            $('#task_detail_attachment').trigger('click');
        });
        $('#task_detail_attachment').change(function () {
            showPreview(this, 'attachment_preview');
            $('#task_detail_attachname').html(this.files[0].name);
            $('#task_detail .ui-content .widget-content').animate({
                scrollTop: $('#task_detail .ui-content .widget-content')[0].scrollHeight
            }, 200);
        });
    },
    search: function (data) {
        var rs = getFormJSON(data);
        var found = false;
        var matches = [];
        var qry = $.trim(rs.query);
        var res = user.tasks();
        $.each(res, function (index, row) {
            if (qry === row.no) {
                found = true;
                matches.push(row);
            }
        });
        if (found === false) {
            qry = qry.toLowerCase();
            $.each(res, function (index, row) {
                var name = row.name;
                name = name.toLowerCase();
                if (name.indexOf(qry) > 0) {
                    matches.push(row);
                    found = true;
                }
            });
        }
        if (found) {
            user.search(matches);
            tasks.list(0, (config.limit - 1), 'search');
            $('#search_task .icon').removeClass('hide');
        } else {
            openAlertPopup('No results found', 'Information', 'Ok', 'validate');
        }
    },
    clearSearch: function () {
        $('#search_task .icon').addClass('hide');
        $('#search_task input[type=text]').val('');
        tasks.list(0, (config.limit - 1), 'main');
    },
    listCategories: function (id, from, to) {
        var rs = tasks.getById(id);
        $('#store_name').html(rs.name);
        var out = '';
        var data = tasks.categories();
        if (data !== '') {
            $.each(data, function (index, row) {
                if (index >= from && index <= to) {
                    out = out + '<a href="#" class="task" onclick="showToast(\'Work on progress\', \'short\', \'center\');">' + (index + 1) + ' - ' + row.name + '<span class="icon"><i class="icon-angle-double-right"></i></span></a>';
                }
            });
        }
        if (out !== '') {
            $('#category_list').empty();
            $('#category_list').append(out);
        }
        tasks.navigations('category', from, to, data.length, id);
    },
    /************Local storages*********************/
    categories: function (data) {
        var rs = $.parseJSON(getVal(config.user));
        if (typeof data !== "undefined") {
            rs.categories = data;
            setVal(config.user, JSON.stringify(rs));
        } else {
            var val = '';
            if (typeof rs.categories !== 'undefined') {
                val = rs.categories;
            }
            return val;
        }
    }
};