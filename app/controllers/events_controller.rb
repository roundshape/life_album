class EventsController < ApplicationController
  include CommonMethods
  
  def index
    @month = params[:month] ? Date.parse(params[:month]) : Date.today
    @previous_month = @month.prev_month
    @next_month = @month.next_month

    @events = fetch_events_for_month(@month) #@eventsを_my_calendar.htm.erbへ
  end

  def nav_month
    # パラメータから月を取得して適切なデータをフェッチする
    month_param = params[:month].gsub(/\A"|"\Z/, '')
    # params[:month]がYYYY-MM-DD形式かどうかをチェック
    if month_param.match?(/\A\d{4}-\d{2}-\d{2}\Z/)
      # YYYY-MM-DD形式の場合はそのままDate.parseを使用
      @month = Date.parse(month_param)
    else #YYYY-MM形式の場合は-01を追加してDate.parseを使用
      @month = Date.parse(month_param + "-01")
    end

    # @month = Date.parse(month_param)
    @previous_month = @month.prev_month
    @next_month = @month.next_month

    @events = fetch_events_for_month(@month) #@eventsを_my_calendar.htm.erbへ

    # カレンダーのHTMLをレンダリング
    calendar_html = render_to_string(partial: 'my_calendar',
                                      locals: { month: @month },
                                      layout: false)
    respond_to do |format|
      format.json {
        render json: {
          calendarHtml: calendar_html,
          nextMonth: @next_month.strftime('%Y-%m-01'),
          previousMonth: @previous_month.strftime('%Y-%m-01'),
          currentYear: @month.year,
          currentMonthName: t('date.month_names')[@month.month]
        }
      }
    end
  end

  def date_events
    # URLパラメータから日付を取得
    clicked_date = Date.parse(params[:date])
    start_of_clicked_date = clicked_date.beginning_of_day
    end_of_clicked_date = clicked_date.end_of_day

    # 指定された日付がイベントの開始日と終了日の範囲内にあるイベントを取得
    @events = Event.where('start_date <= ? AND end_date >= ?', end_of_clicked_date, start_of_clicked_date)

    # JSON形式でレスポンスを返す
    render json: @events
  end

  def create
    @event = Event.new(event_params)
    if @event.valid?
        @event.save
        render json: { status: 'success', redirect_to: root_path }, status: :ok and return
    else
      render json: { status: 'error', errors: @event.errors.full_messages }, status: :unprocessable_entity
    end    
  end
  
  private

  def event_params
    params.require(:event).permit(:name, :start_date, :end_date)
  end
  
  def fetch_events_for_month(month)
    start_date = month.beginning_of_month.beginning_of_day
    end_date = month.end_of_month.end_of_day
    Event.where('start_date <= ? AND end_date >= ?', end_date, start_date)
  end
end
