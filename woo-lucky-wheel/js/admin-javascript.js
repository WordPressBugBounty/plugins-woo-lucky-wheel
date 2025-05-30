jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.menu .item').vi_tab({
        history: true,
        historyType: 'hash'
    });
    if ($('.vi-ui.accordion').length) {
        $('.vi-ui.accordion:not(.wlwl-accordion-init)').addClass('wlwl-accordion-init').vi_accordion('refresh');
    }
    $('.vi-ui.checkbox:not(.wlwl-checkbox-init)').addClass('wlwl-checkbox-init').off().checkbox();
    $('.vi-ui.dropdown:not(.wlwl-dropdown-init)').addClass('wlwl-dropdown-init').off().dropdown();

    $('.wheel-settings .ui-sortable').sortable({
        update: function (event, ui) {
            indexChangeCal();
        }
    });

    /*Color picker*/
    $('.color-picker').iris({
        change: function (event, ui) {
            $(this).parent().find('.color-picker').css({backgroundColor: ui.color.toString()});
            if ($(this).parent().find('#wheel_wrap_bg_color')){
                $('.wlwl-image-container').find('.review-images').css({'background' : ui.color.toString()});
            }
            let ele = $(this).data('ele');
            if (ele == 'highlight') {
                $('#message-purchased').find('a').css({'color': ui.color.toString()});
            } else if (ele == 'textcolor') {
                $('#message-purchased').css({'color': ui.color.toString()});
            } else {
                $('#message-purchased').css({backgroundColor: ui.color.toString()});
            }
        },
        hide: true,
        border: true
    }).on('click',function () {
        $('.iris-picker').hide();
        $(this).closest('td').find('.iris-picker').show();
    });

    $('body').on('click',function () {
        $('.iris-picker').hide();
    });
    $('.color-picker').on('click',function (event) {
        event.stopPropagation();
    });

    //check Probability value
    $('.probability').on('keyup',function () {
        let check_max = $(this).val();
        if (check_max > 100) {
            $(this).val(100);
        }

    });
    remove_piece();


    function clone_piece() {
        $('.clone_piece').on('click', function () {
            if ($('.wheel_col').length >= 6) {
                alert("Maximum pieces quantity is 6");
            } else {
                let new_row = $(this).parent().parent().clone();
                let total_temp = parseInt($('.total_probability').attr('data-total_probability'));
                let new_val = 0;
                if (total_temp + parseInt(new_row.find('input[name="probability[]"]').val()) <= 100) {
                    new_val = parseInt(new_row.find('input[name="probability[]"]').val());
                }
                $('.total_probability').html(total_temp + new_val);
                $('.total_probability').attr('data-total_probability', total_temp + new_val);
                new_row.find('input[name="probability[]"]').val(new_val);

                new_row.insertAfter($(this).parent().parent());
                indexChangeCal();
                changes_probability();
                remove_piece();
                $('.color-picker').iris({
                    change: function (ev, uis) {
                        $(this).parent().find('.color-picker').css({backgroundColor: uis.color.toString()});
                    },
                    hide: true,
                    border: true,
                    width: 270
                }).on('click', function (e) {
                    e.stopPropagation();
                });
                check_coupon();
                $('.clone_piece').unbind();
                clone_piece();
            }
        });

    }

    clone_piece();

    function remove_piece() {
        $('.remove_field').unbind();
        $('.probability').on('change', function () {
            changes_probability();
        });
        $('.remove_field').on('click', function () {
            changes_probability();
            if (confirm("Would you want to remove this?")) {
                if ($('.wheel_col').length > 3) {
                    $(this).closest('tr').remove();
                    changes_probability();
                    indexChangeCal();
                } else {
                    alert('Must have at least 3 columns!');
                    return false;
                }
            }
        });
    }

    function changes_probability() {// check probability
        let tong = 0;
        $('.probability').each(function () {
            let chek = $(this).val();
            if ($.isNumeric(chek) === true) {
                tong += parseInt(chek);
            }
        });
        $('.total_probability').html(tong);
        $('.total_probability').attr('data-total_probability', tong);
        return tong;
    }

    $('.wlw-submit').on('click', function () {
        let tong = changes_probability();
        let label = document.getElementsByClassName('custom_type_label');
        if (tong == 100) {
            for (let i = 0; i < label.length; i++) {
                if ($('.custom_type_label').eq(i).val() === '') {
                    alert('Label cannot be empty.');
                    $('.custom_type_label').eq(i).focus();
                    return false;

                }
                if ($('.coupons_select').eq(i).val() === 'custom' && $('.custom_type_value').eq(i).val() === '') {
                    alert('Value cannot be empty.');
                    $('.custom_type_value').eq(i).focus();
                    return false;

                }
                if ($('.coupons_select').eq(i).val() === 'existing_coupon' && $('select[name="wlwl_existing_coupon[]"]')[i].lastElementChild.innerHTML == '') {
                    alert('Value of Existing coupon cannot be empty.');
                    $('select[name="wlwl_existing_coupon[]"]')[i].focus();
                    return false;

                }
            }
        } else {
            alert('The total probability must be 100%.');
            return false;
        }
        if (getCookie('wlwl_cookie')) {
            let notify_show_again = $('#notify_show_again').val(),
                notify_show_again_unit = $('select[name="notify_show_again_unit"]').val(),
                notify_time_on_close_unit = $('select[name="notify_time_on_close_unit"]').val(),
                notify_time_on_close = $('#notify_time_on_close').val();
            if (notify_time_on_close != woo_lucky_wheel_params_admin.time_on_close || notify_time_on_close_unit != woo_lucky_wheel_params_admin.time_on_close_unit ||
                notify_show_again != woo_lucky_wheel_params_admin.show_again || notify_show_again_unit != woo_lucky_wheel_params_admin.show_again_unit) {
                setCookie('wlwl_cookie', '', 0);
            }
        }

        return true;
    });
    function setCookie(cname, cvalue, expire) {
        let d = new Date();
        d.setTime(d.getTime() + (expire * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function indexChangeCal() {
        let ind = document.getElementsByClassName('wheel_col_index');
        for (let i = 0; i < ind.length; i++) {
            $('.wheel_col_index')[i].innerHTML = (i + 1);
        }
    }

    indexChangeCal();

    function check_coupon() {
        $('.coupons_select').dropdown({
            onChange: function (val) {
                if (val === 'non') {
                    $(this).parent().parent().find('.coupon_amount').val(0);
                    $(this).parent().parent().find('.coupon_amount').prop('readonly', true);
                    $(this).parent().parent().find('.coupon_amount').addClass('coupon-amount-readonly');
                    $(this).parent().parent().find('.coupon_amount').show();
                    $(this).parent().parent().find('.custom_type_value').hide();
                    $(this).parent().parent().find('.custom_type_label').val('Not Lucky');
                    $(this).parent().parent().find('.wlwl_existing_coupon').hide();
                } else if (val === 'custom') {
                    $(this).parent().parent().find('.wlwl_existing_coupon').hide();
                    $(this).parent().parent().find('.coupon_amount').hide();
                    $(this).parent().parent().find('.custom_type_value').val('');
                    $(this).parent().parent().find('.custom_type_label').val('');
                    $(this).parent().parent().find('.custom_type_value').show();

                } else {
                    $(this).parent().parent().find('.custom_type_label').val($('#wheel_label_coupon').val());
                    if (val === 'existing_coupon') {
                        $(this).parent().parent().find('.coupon_amount').hide();
                        $(this).parent().parent().find('.custom_type_value').hide();
                        $(this).parent().parent().find('.wlwl_existing_coupon').show();
                    } else {
                        $(this).parent().parent().find('.wlwl_existing_coupon').hide();
                        $(this).parent().parent().find('.coupon_amount').removeClass('coupon-amount-readonly');
                        $(this).parent().parent().find('.coupon_amount').prop('readonly', false);
                        $(this).parent().parent().find('.coupon_amount').show();
                        $(this).parent().parent().find('.custom_type_value').hide();
                    }
                }
            }
        })
    }

    check_coupon();

    $('.wlwl_color_palette').on('click', function () {
        let color_code = $(this).data('color_code');
        let color_array = [],color_des = $('.color_palette').data('color_arr')[color_code];
        if (color_des?.pointer){
            $('#pointer_color').val(color_des.pointer).trigger('change');
        }
        $('#wheel_wrap_bg_color').val(color_code).trigger('change');
        if (color_des?.color && color_des.color.length){
            color_array = color_des.color;
        }
        let piece_color = $('.wheel_col').find('input[name="bg_color[]"]').map(function () {
            return $(this).val();
        }).get();
        let color_size = color_array.length,piece_size = piece_color.length,i, j = 0;
        for (i = 0; i < piece_size; i++) {
            if (j == color_size) {
                j = 0;
            }
            $('.wheel_col').find('input[name="bg_color[]"]').eq(i).val(color_array[j]).css({'background-color': color_array[j]});
            j++;
        }
        $('.auto_color_ok').on('click', function () {
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        });
        $('.auto_color_cancel').on('click', function () {
            j = 0;
            for (i = 0; i < piece_size; i++) {
                if (j == color_size) {
                    j = 0;
                }
                $('.wheel_col').find('input[name="bg_color[]"]').eq(i).val(piece_color[j]).css({'background-color': piece_color[j]});
                j++;
            }
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        })
    });
    $('.auto_color').on('click', function () {
        $('.color_palette').css({'display': 'flex'});
        $('.auto_color_ok_cancel').css({'display': 'inline-block'});
        $(this).hide();
        $('.auto_color_ok').on('click', function () {
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        });
        $('.auto_color_cancel').on('click', function () {
            $('.color_palette').hide();
            $('.auto_color_ok_cancel').hide();
            $('.auto_color').show();
        })
    });
});

jQuery(document).ready(function ($) {
    'use strict';
    // Set all letiables to be used in scope
    let frame,
        metaBox = $('#wlwl-bg-image'), // Your meta box id here
        addImgLink = metaBox.find('.wlwl-upload-custom-img'),
        imgContainer = metaBox.find('.wlwl-image-container');
    $('.wheel_wrap_bg_image_custom').css('margin-top','15px');
    $('.wheel_wrap_bg_image_type').dropdown({
        onChange:function (val) {
            handle_choose_bg_image_type(val);
        }
    });
    handle_choose_bg_image_type($('.wheel_wrap_bg_image_type select').val())
    function handle_choose_bg_image_type(val){
        if (parseInt(val)){
            $('.wheel_wrap_bg_image_custom').show();
            if ($('.wlwl-remove-image').length){
                $('.wlwl-upload-custom-img').hide();
            }else {
                $('.wlwl-upload-custom-img').show();
            }
        }else {
            $('.wheel_wrap_bg_image_custom').hide();
            $('.wheel_wrap_bg_image').val(woo_lucky_wheel_params_admin.bg_img_default);
            imgContainer.find('.review-images').attr({src:woo_lucky_wheel_params_admin.bg_img_default});
        }
    }

    // ADD IMAGE LINK
    addImgLink.on('click', function (event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame) {
            frame.open();
            return;
        }

        // Create a new media frame
        frame = wp.media({
            title: 'Select or Upload Media Of Your Chosen Persuasion',
            button: {
                text: 'Use this media'
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });


        // When an image is selected in the media frame...
        frame.on('select', function () {

            // Get media attachment details from the frame state
            let attachment = frame.state().get('selection').first().toJSON();
            console.log(attachment);
            let attachment_url;
            if (attachment.sizes.thumbnail) {
                attachment_url = attachment.sizes.thumbnail.url;
            } else if (attachment.sizes.medium) {
                attachment_url = attachment.sizes.medium.url;
            } else if (attachment.sizes.large) {
                attachment_url = attachment.sizes.large.url;
            } else if (attachment.url) {
                attachment_url = attachment.url;
            }
            // Send the attachment URL to our custom image input field.
            imgContainer.append('<img style="width: 300px;background:'+$('#wheel_wrap_bg_color').val() + '"class="review-images" src="' + attachment_url + '"/><input class="wheel_wrap_bg_image" name="wheel_wrap_bg_image" type="hidden" value="' + attachment.id + '"/><span class="wlwl-remove-image negative vi-ui button small">Remove</span>');

            $('.wlwl-upload-custom-img').hide();

        });

        // Finally, open the modal on click
        frame.open();
    });
    // DELETE IMAGE LINK
    $(document).on('click','.wlwl-remove-image', function (event) {
        event.preventDefault();
        $(this).parent().html('');
        $('.wlwl-upload-custom-img').show();
    });
});
jQuery(document).ready(function ($) {
    'use strict';
    // Set all letiables to be used in scope
    let frame1,
        metaBox1 = $('#wlwl-bg-image1'), // Your meta box id here
        addImgLink1 = metaBox1.find('.wlwl-upload-custom-img1'),
        imgContainer1 = metaBox1.find('#wlwl-new-image1');

    // ADD IMAGE LINK
    addImgLink1.on('click', function (event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame1) {
            frame1.open();
            return;
        }

        // Create a new media frame
        frame1 = wp.media({
            title: 'Select or Upload Media Of Your Chosen Persuasion',
            button: {
                text: 'Use this media'
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });


        // When an image is selected in the media frame...
        frame1.on('select', function () {

            // Get media attachment details from the frame state
            let attachment1 = frame1.state().get('selection').first().toJSON();
            console.log(attachment1);
            let attachment_url1;
            if (attachment1.sizes.thumbnail) {
                attachment_url1 = attachment1.sizes.thumbnail.url;
            } else if (attachment1.sizes.medium.url) {
                attachment_url1 = attachment1.sizes.medium;
            } else if (attachment1.sizes.large.url) {
                attachment_url1 = attachment1.sizes.large;
            } else if (attachment1.url) {
                attachment_url1 = attachment1.url;
            }

            // Send the attachment URL to our custom image input field.
            imgContainer1.append('<div class="wlwl-image-container1"><img style="border: 1px solid;"class="review-images" src="' + attachment_url1 + '"/><input class="wheel_center_image" name="wheel_center_image" type="hidden" value="' + attachment1.id + '"/><span class="wlwl-remove-image1 nagative vi-ui button">Remove</span></div>');

            $('.wlwl-upload-custom-img1').hide();
            $('.wlwl-remove-image1').on('click', function (event) {
                event.preventDefault();
                $(this).parent().html('');
                $('.wlwl-upload-custom-img1').show();
            })

        });

        // Finally, open the modal on click
        frame1.open();
    });
    // DELETE IMAGE LINK

    $('.wlwl-remove-image1').on('click', function (event) {
        event.preventDefault();
        $(this).parent().html('');
        $('.wlwl-upload-custom-img1').show();
    });
    $(".category-search").select2({
        closeOnSelect: false,
        placeholder: "Please enter category title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_cate",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
    $(".product-search").select2({
        closeOnSelect: false,
        placeholder: "Please fill in your product title",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_product",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
    $(".coupon-search").select2({
        placeholder: "Type coupon code here",
        ajax: {
            url: "admin-ajax.php?action=wlwl_search_coupon",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
//    select google font
    $('#wlwl-google-font-select').fontselect().change(function () {
        // replace + signs with spaces for css
        $('#wlwl-google-font-select').val($(this).val());
        $('.wlwl-google-font-select-remove').show();
    });
    $('.wlwl-google-font-select-remove').on('click', function () {
        $(this).parent().find('.font-select span').html('<span>Select a font</span>');
        $('#wlwl-google-font-select').val('');
        $(this).hide();
    })
    /*design button "shop now"*/
    let buttonShopNow = $('.wlwl-button-shop-now');

    $('#wlwl_button_shop_url').on('keyup', function () {
        buttonShopNow.attr('href', $(this).val());
    });

    $('.preview-emails-html-overlay').on('click', function () {
        $('.preview-emails-html-container').addClass('preview-html-hidden');
    })
    $('.wlwl-preview-emails-button').on('click', function () {
        $('.wlwl-preview-emails-button').html('Please wait...');
        $.ajax({
            url: woo_lucky_wheel_params_admin.url,
            type: 'GET',
            dataType: 'JSON',
            data: {
                action: 'wlwl_preview_emails',
                heading: $('#heading').val(),
                content: tinyMCE.get('content') ? tinyMCE.get('content').getContent() : $('#content').val(),
                button_shop_url: $('#wlwl_button_shop_url').val(),
            },
            success: function (response) {
                $('.wlwl-preview-emails-button').html('Preview emails');
                if (response) {
                    $('.preview-emails-html').html(response.html);
                    $('.preview-emails-html-container').removeClass('preview-html-hidden');
                }
            },
            error: function (err) {
                $('.wlwl-preview-emails-button').html('Preview emails');
            }
        })
    })
    /*preview wheel*/
    $('.woocommerce-lucky-wheel-preview-overlay').on('click', function () {
        $('.woocommerce-lucky-wheel-preview').addClass('preview-html-hidden');
    })
    $('.preview-lucky-wheel').on('click', function () {
        $(this).addClass('loading');
        let color = [];
        $('input[name="bg_color[]"]').map(function () {
            color.push($(this).val());
        });
        let slice_text_color = $('#slice_text_color').val();
        let label = [];
        $('input[name="custom_type_label[]"]').map(function () {
            label.push($(this).val());
        });
        let coupon_type = [];
        $('select[name="coupon_type[]"]').map(function () {
            coupon_type.push($(this).val());
        });
        let coupon_amount = [];
        $('input[name="coupon_amount[]"]').map(function () {
            coupon_amount.push($(this).val());
        });
        $.ajax({
            url: woo_lucky_wheel_params_admin.url,
            type: 'GET',
            dataType: 'JSON',
            data: {
                action: 'wlwl_preview_wheel',
                label: label,
                coupon_type: coupon_type,
                coupon_amount: coupon_amount,
            },
            success: function (response) {
                $('.preview-lucky-wheel').removeClass('loading');
                let wlwl_center_color = $('#wheel_center_color').val();
                let wlwl_border_color = '#ffffff';
                let wlwl_dot_color = '#000000';
                let slices = color.length;
                let sliceDeg = 360 / slices;
                let deg = -(sliceDeg / 2);
                let cv = document.getElementById('wlwl_canvas');
                let ctx = cv.getContext('2d');
                let width = 400;// size
                cv.width = width;
                cv.height = width;
                let center = (width) / 2;
                let wheel_text_size = parseInt(width / 28);
                if (response.labels) {
                    let labels = response.labels;

                    for (let i = 0; i < slices; i++) {
                        drawSlice(ctx, deg, color[i]);
                        drawText(ctx, deg + sliceDeg / 2, labels[i], slice_text_color, wheel_text_size);
                        deg += sliceDeg;

                    }
                    cv = document.getElementById('wlwl_canvas1');
                    ctx = cv.getContext('2d');
                    cv.width = width;
                    cv.height = width;
                    drawPoint(ctx, deg, wlwl_center_color);
                    let center_image = $('input[name="wheel_center_image"]').parent().find('img').attr('src');
                    if (center_image) {
                        let wl_image = new Image;
                        wl_image.onload = function () {
                            cv = document.getElementById('wlwl_canvas1');
                            ctx = cv.getContext('2d');
                            let image_size = 2 * (width / 8 - 7);
                            ctx.arc(center, center, image_size / 2, 0, 2 * Math.PI);
                            ctx.clip();
                            ctx.drawImage(wl_image, center - image_size / 2, center - image_size / 2, image_size, image_size);

                        };
                        wl_image.src = center_image;
                    }
                    drawBorder(ctx, wlwl_border_color, 'rgba(0,0,0,0)', 20, 4, 5, 'rgba(0,0,0,0.2)');
                    cv = document.getElementById('wlwl_canvas2');
                    ctx = cv.getContext('2d');

                    cv.width = width;
                    cv.height = width;
                    drawBorder(ctx, 'rgba(0,0,0,0)', wlwl_dot_color, 20, 4, 5, 'rgba(0,0,0,0)');

                    $('.woocommerce-lucky-wheel-preview').removeClass('preview-html-hidden');
                }

                function deg2rad(deg) {
                    return deg * Math.PI / 180;
                }

                function drawSlice(ctx, deg, color) {
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.moveTo(center, center);
                    let r;
                    if (width <= 480) {
                        r = width / 2 - 10;
                    } else {
                        r = width / 2 - 14;
                    }
                    ctx.arc(center, center, r, deg2rad(deg), deg2rad(deg + sliceDeg));
                    ctx.lineTo(center, center);
                    ctx.fill();
                }

                function drawPoint(ctx, deg, color) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 1;
                    ctx.shadowOffsetX = 8;
                    ctx.shadowOffsetY = 8;
                    ctx.shadowColor = 'rgba(0,0,0,0.2)';
                    ctx.arc(center, center, width / 8, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.clip();
                    ctx.restore();
                }

                function drawBorder(ctx, borderC, dotC, lineW, dotR, des, shadColor) {
                    ctx.beginPath();
                    ctx.strokeStyle = borderC;
                    ctx.lineWidth = lineW;
                    ctx.shadowBlur = 1;
                    ctx.shadowOffsetX = 8;
                    ctx.shadowOffsetY = 8;
                    ctx.shadowColor = shadColor;
                    ctx.arc(center, center, center, 0, 2 * Math.PI);
                    ctx.stroke();
                    let x_val, y_val, deg;
                    deg = sliceDeg / 2;
                    let center1 = center - des;
                    for (let i = 0; i < slices; i++) {
                        ctx.beginPath();
                        ctx.fillStyle = dotC;
                        x_val = center + center1 * Math.cos(deg * Math.PI / 180);
                        y_val = center - center1 * Math.sin(deg * Math.PI / 180);
                        ctx.arc(x_val, y_val, dotR, 0, 2 * Math.PI);
                        ctx.fill();
                        deg += sliceDeg;
                    }
                }

                function drawText(ctx, deg, text, color, wheel_text_size) {
                    ctx.save();
                    ctx.translate(center, center);
                    ctx.rotate(deg2rad(deg));
                    ctx.textAlign = "right";
                    ctx.fillStyle = color;
                    ctx.font = '200 ' + wheel_text_size + 'px Helvetica';
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    text = text.replace(/&#(\d{1,4});/g, function (fullStr, code) {
                        return String.fromCharCode(code);
                    });
                    let reText = text.split('\/n'), text1 = '', text2 = '';
                    if (reText.length > 1) {
                        text1 = reText[0];
                        text2 = reText.splice(1, reText.length - 1);
                        text2 = text2.join('');
                    }
                    if (text1.trim() !== "" && text2.trim() !== "") {
                        ctx.fillText(text1.trim(), 7 * center / 8, -(wheel_text_size * 1 / 4));
                        ctx.fillText(text2.trim(), 7 * center / 8, wheel_text_size * 3 / 4);
                    } else {
                        ctx.fillText(text, 7 * center / 8, wheel_text_size / 2 - 2);
                    }
                    ctx.restore();
                }
            },
            error: function (err) {
                $('.wlwl-preview-emails-button').html('Preview emails');
                $('.preview-lucky-wheel').removeClass('loading');
            }
        })


    })

});
